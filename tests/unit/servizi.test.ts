import { describe, it, expect } from 'vitest';
import { servizi, serviziTop } from '../../src/data/servizi';

describe('servizi', () => {
  it('contiene almeno 6 servizi', () => {
    expect(servizi.length).toBeGreaterThanOrEqual(6);
  });

  it('ogni servizio ha campi richiesti', () => {
    for (const s of servizi) {
      expect(s.slug).toBeTruthy();
      expect(s.titolo).toBeTruthy();
      expect(s.descrizioneBreve).toBeTruthy();
      expect(s.descrizioneEstesa).toBeTruthy();
      expect(s.icon).toBeTruthy();
    }
  });

  it('slug univoci e in kebab-case', () => {
    const slugs = servizi.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('icona è SVG inline con viewBox 24x24', () => {
    for (const s of servizi) {
      expect(s.icon).toMatch(/^<svg /);
      expect(s.icon).toContain('viewBox="0 0 24 24"');
      expect(s.icon).toContain('</svg>');
      expect(s.icon).toContain('aria-hidden="true"');
    }
  });

  it('descrizioni hanno lunghezza ragionevole', () => {
    for (const s of servizi) {
      expect(s.descrizioneBreve.length).toBeGreaterThan(30);
      expect(s.descrizioneBreve.length).toBeLessThan(220);
      expect(s.descrizioneEstesa.length).toBeGreaterThan(80);
    }
  });
});

describe('serviziTop', () => {
  it('contiene esattamente 3 servizi', () => {
    expect(serviziTop.length).toBe(3);
  });

  it('è subset di servizi (stessi riferimenti)', () => {
    for (const s of serviziTop) {
      expect(servizi).toContain(s);
    }
  });
});
