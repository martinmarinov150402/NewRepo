import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import {configObject} from './config.object';
import {ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  if(process.env.NODE_ENV === 'development'){
    app.enableCors();
  }
  else
  {
    app.enableCors();
  }
  const port = configObject.port;
  await app.listen(port);
  const logger=new Logger();
  logger.verbose("Listening on port "+port);
  
}
bootstrap();
