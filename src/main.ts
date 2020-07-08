import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  console.log(process.env.DB_HOST+" "+process.env.DB_PORT+" "+process.env.DB_USERNAME+" "+process.env.DB_PASSWORD);
  const serverConfig = config.get('server');
  const app = await NestFactory.create(AppModule);

  if(process.env.NODE_ENV === 'development'){
    app.enableCors();
  }
  else
  {
    app.enableCors();
  }
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  
}
bootstrap();
