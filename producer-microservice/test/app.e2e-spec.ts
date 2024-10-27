import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { KafkaProducerService } from './../src/producer/kafka-producer.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const mockKafkaProducerService = {
    publish: jest.fn().mockImplementation(() => Promise.resolve()),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(KafkaProducerService)
      .useValue(mockKafkaProducerService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/channels/publish', () => {
    it('success (POST)', () => {
      return request(app.getHttpServer()).post('/channels/publish').expect(201);
    });

    it('failure (POST)', () => {
      mockKafkaProducerService.publish.mockRejectedValue('An Error Occurred');
      return request(app.getHttpServer())
        .post('/channels/publish')
        .expect(500)
        .expect({ statusCode: 500, message: 'Internal server error' });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
