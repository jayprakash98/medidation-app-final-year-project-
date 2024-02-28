import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const HOST = '10.210.33.49' || process.env.HOST;
const PORT = 3000 || process.env.PORT;

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT);
})();
