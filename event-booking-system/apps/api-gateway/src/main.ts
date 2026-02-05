import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors(); // Allow frontend access
    await app.listen(3001);
    console.log('API Gateway is running on http://localhost:3001');
}
bootstrap();
