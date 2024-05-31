
build:
	docker compose pull
	docker compose build

up:
	docker compose up

test: build up

down:
	docker compose down
	