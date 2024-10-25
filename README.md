# nestjs-microservice-example

Small microservice demo using nestjs, kafka, mongodb and react. It gets the data from [mathworks public channels api](https://api.thingspeak.com/channels/public.json), processes it through Kafka, and stores the processed data in mongodb, and displays the data using simple react app, all orchestrated with Docker Compose for easy local setup.

## To Try it out

Install dependencies and build docker images for all apps:

### producer-microservice

- `cd producer-microservice && yarn install`
- `docker build -t nestjs-microservice-example/producer:latest .`

### consumer-microservice

- `cd consumer-microservice && yarn install`
- `docker build -t nestjs-microservice-example/consumer:latest .`

### channels-fe

- `cd channels-fe && yarn install`
- `docker build -t nestjs-microservice-example/fe:latest .`

### You can start the demo by:

- Building docker images for all services as mentioned above.
- Bringing containers up: `docker-compose up -d`
- Send a request to producer-service: `curl --location --request POST 'http://localhost:3001/channels/publish'`

Finaly just open the [channels-fe](http://localhost:3002) in the browser!

- Use following credentials `username: john, password: changeme`

## Debugging:

- You can use docker desktop to see the running containers and see the logs there.
- You can connect directly to the kafka container and execute producer/consumer consoles
- Kafdrop is included in the docker-compose file, you can access it by going to: `localhost:19000`

## References

- https://docs.nestjs.com/techniques/http-module
- https://docs.nestjs.com/techniques/database
- https://docs.nestjs.com/security/authentication
- https://docs.nestjs.com/microservices/basics
- https://docs.nestjs.com/microservices/kafka
- https://hub.docker.com/r/apache/kafka
- https://kafka.apache.org/intro
- https://create-react-app.dev/docs/getting-started
- https://mui.com/material-ui/getting-started/example-projects/

## TODO

- Use some authentication provider instead of storing credentials locally.
- add tests
