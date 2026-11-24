import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('ApexBankingBootstrap');
  const app = await NestFactory.create(AppModule);

  // Set Global API Route Prefix
  app.setGlobalPrefix('api/v1');

  // WebSocket Adapter (Pure WS protocol)
  app.useWebSocketAdapter(new WsAdapter(app));

  // Global Exception Filter (RFC 7807 Format)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Strict Request Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Cross-Origin Resource Sharing (CORS)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // OpenAPI Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('APEX BANKING - Institutional Core Banking API')
    .setDescription(
      'REST & WebSocket APIs for Indian Retail and Commercial Banking. Compliant with RBI Master Directions and NPCI UPI 2.0 Specifications.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication & Security')
    .addTag('Accounts & Balances')
    .addTag('Payments & Money Transfers')
    .addTag('UPI 2.0 Payment Services')
    .addTag('Beneficiary Management')
    .addTag('Debit Cards & Controls')
    .addTag('Fixed Term Deposits')
    .addTag('Loan & Retail Credit Services')
    .addTag('e-KYC & Regulatory Compliance')
    .addTag('Settlement Reconciliation Engine')
    .addTag('Fraud & Risk Analytics')
    .addTag('Admin Operations & Telemetry')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  logger.log(`================================================================`);
  logger.log(`🚀 APEX BANKING Institutional Backend Online on Port ${port}`);
  logger.log(`📑 Swagger OpenAPI Docs: http://localhost:${port}/api/docs`);
  logger.log(`⚡ WebSocket Stream: ws://localhost:${port}/ws`);
  logger.log(`🛡️  Regulatory Sandbox: Active with Zero Fake Balances`);
  logger.log(`================================================================`);
}

bootstrap();
