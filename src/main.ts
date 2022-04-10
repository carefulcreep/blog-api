import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: 'GET,POST',
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('API blog')
    .setDescription('Facing API for Client UI')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  app.use('/swagger.json', (req, res) => res.json(document));
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const configService: ConfigService = app.get(ConfigService);

  await app.listen(configService.port);
  console.log(`Server is listening on http://localhost:${configService.port}`);
  console.log(`Find docs on http://localhost:${configService.port}/docs`);
}
bootstrap();
