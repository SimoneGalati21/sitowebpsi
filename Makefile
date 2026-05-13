.PHONY: help install dev up down logs shell build preview clean rebuild ps

COMPOSE := docker compose

help: ## Mostra comandi disponibili
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

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
	rm -rf dist node_modules .astro

rebuild: ## Ricostruisce immagine Docker da zero
	$(COMPOSE) build --no-cache

ps: ## Stato container
	$(COMPOSE) ps
