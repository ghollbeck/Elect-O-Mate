
test:
	docker compose build
	docker compose pull
	docker compose up 

down:
	docker compose down
	