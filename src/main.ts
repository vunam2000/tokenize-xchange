import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './configs/filters/catchError';
import CustomLogger from './modules/log/customLogger';
import getLogLevels from './utils/getLogLevels';
import { TransformInterceptor } from './configs/interceptors/transform.interceptor';
import { CrawlDataService } from './modules/crawl-data/crawlData.service';
import { GraphTokenService } from './modules/graph-token/graphToken.service';
import { TOKEN_PAIRS, TRIANGLE_ARBITRAGES } from './configs/constants/token';

async function bootstrap() {
  // Logger
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
    bufferLogs: true,
  });
  app.useLogger(app.get(CustomLogger));

  // Crawl data
  const crawlDataService = app.get(CrawlDataService);
  console.log(crawlDataService);
  crawlDataService.crawlBinanceBookTicker();

  // Update graph
  const graphTokenService = app.get(GraphTokenService);
  setInterval(() => {
    console.log('updateGraphEdge');
    TOKEN_PAIRS.forEach((token) => {
      graphTokenService.updateGraphEdge(token);
    });
  }, 2500);

  // Detect triangle arbitrage
  setInterval(() => {
    console.log('detectTriangleArbitrage', TRIANGLE_ARBITRAGES);
    TRIANGLE_ARBITRAGES.forEach((triangleArbitrage) => {
      graphTokenService.detectTriangleArbitrage(triangleArbitrage);
    });
  }, 2500);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4300'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());

  // Catch exception
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API with NestJS')
    .setDescription('API developed throughout the API with NestJS course')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
