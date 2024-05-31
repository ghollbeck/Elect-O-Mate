
build:
	docker compose pull
	docker compose build --build-arg REACT_APP_BACKEND_URL=http://localhost:8000

up:
	docker compose up

test: build up

down:
	docker compose down
	