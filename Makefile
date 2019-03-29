up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker build -t trstruth/rehearsal:latest ./image
