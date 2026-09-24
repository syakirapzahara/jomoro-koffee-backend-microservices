import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Jomoro Koffee - Transaction Service')
    .setDescription('Shopping cart, orders, and checkout API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  console.log(`Transaction Service running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api`);
}

bootstrap();
