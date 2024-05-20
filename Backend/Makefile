cloudflare:
	./start_tunnel.sh

backend:
	python main.py

all: cloudflare backend

docker:
	docker buildx build --platform=linux/amd64 -t bruol0/elect-o-mate:latest .
	docker push bruol0/elect-o-mate:latest