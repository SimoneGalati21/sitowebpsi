import { describe, it, expect } from 'vitest';
import { profilo } from '../../src/data/profilo';

describe('profilo', () => {
  it('ha tutti i campi obbligatori', () => {
    expect(profilo.nome).toBeTruthy();
    expect(profilo.titolo).toBeTruthy();
    expect(profilo.albo).toBeTruthy();
    expect(profilo.bio).toBeTruthy();
    expect(profilo.approccio).toBeTruthy();
    expect(profilo.orari).toBeTruthy();
  });

  it('email in formato valido', () => {
    expect(profilo.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('tel in formato E.164', () => {
    expect(profilo.tel).toMatch(/^\+\d{8,15}$/);
  });

  it('whatsapp solo cifre', () => {
    expect(profilo.whatsapp).toMatch(/^\d{8,15}$/);
  });

  it('indirizzo completo', () => {
    expect(profilo.indirizzo.via).toBeTruthy();
    expect(profilo.indirizzo.citta).toBeTruthy();
    expect(profilo.indirizzo.cap).toMatch(/^\d{5}$/);
  });

  it('formazione non vuota', () => {
    expect(Array.isArray(profilo.formazione)).toBe(true);
    expect(profilo.formazione.length).toBeGreaterThan(0);
    for (const f of profilo.formazione) {
      expect(typeof f).toBe('string');
      expect(f.length).toBeGreaterThan(5);
    }
  });

  it('mapsEmbedUrl https + google maps', () => {
    expect(profilo.mapsEmbedUrl).toMatch(/^https:\/\/(www\.)?google\.com\/maps/);
  });
});
