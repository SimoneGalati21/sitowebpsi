.PHONY: help install dev up up-d down logs shell build preview clean rebuild ps \
        test test-build test-install test-unit test-e2e test-smoke test-lighthouse test-shell test-clean

COMPOSE := docker compose
TEST_RUN := $(COMPOSE) --profile test run --rm test

help: ## Mostra comandi disponibili
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Installa dipendenze npm dentro container (genera node_modules volume)
	$(COMPOSE) run --rm web npm install

dev: up ## Alias di "up"

up: ## Avvia dev server (HMR su http://localhost:4321)
	$(COMPOSE) up

up-d: ## Avvia dev server in background
	$(COMPOSE) up -d

down: ## Ferma e rimuove container
	$(COMPOSE) down

logs: ## Tail dei log del dev server
	$(COMPOSE) logs -f web

shell: ## Apri shell dentro container web
	$(COMPOSE) run --rm web sh

build: ## Genera sito statico in ./dist
	$(COMPOSE) --profile build run --rm build

preview: ## Anteprima build statica (http://localhost:4321)
	$(COMPOSE) run --rm --service-ports web npm run preview

clean: ## Rimuove dist, node_modules, container
	$(COMPOSE) down -v
	rm -rf dist node_modules .astro lighthouse-reports playwright-report test-results

rebuild: ## Ricostruisce immagine Docker da zero
	$(COMPOSE) build --no-cache

ps: ## Stato container
	$(COMPOSE) ps

test-build: ## Builda l'immagine container test (Playwright + Node 20)
	$(COMPOSE) --profile test build test

test-install: ## Installa devDeps dentro container test
	$(COMPOSE) --profile test run --rm test npm install

test: ## Lancia tutta la test suite (unit + build + smoke + e2e + lighthouse)
	$(TEST_RUN) npm test

test-unit: ## Solo unit test (Vitest)
	$(TEST_RUN) npm run test:unit

test-e2e: ## Solo E2E (Playwright). Builda + preview interno.
	$(TEST_RUN) sh -c "npm run test:build && npm run test:e2e"

test-smoke: ## Solo smoke check post-build su dist/
	$(TEST_RUN) sh -c "npm run test:build && npm run test:smoke"

test-lighthouse: ## Solo Lighthouse (performance/a11y/best-practices/SEO)
	$(TEST_RUN) sh -c "npm run test:build && npm run test:lighthouse"

test-shell: ## Shell dentro container test
	$(TEST_RUN) bash

test-clean: ## Pulisci artefatti test (report, results)
	rm -rf playwright-report test-results lighthouse-reports
