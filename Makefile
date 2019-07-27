VERSION := 1.0.0

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker build -t trstruth/rehearsal:dev ./image

build-prod:
	docker build -t trstruth/rehearsal:$(VERSION) -f ./image/Dockerfile.prod ./image

push:
	docker push trstruth/rehearsal:$(VERSION)
