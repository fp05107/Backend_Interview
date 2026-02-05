import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
    @MessagePattern({ cmd: 'register' })
    register(@Payload() data: any) {
        // In a real app, hash password, save to DB via Prisma
        console.log('Registering user', data);
        return { status: 'success', userId: 'user-123' }; // Mock response
    }

    @MessagePattern({ cmd: 'login' })
    login(@Payload() data: any) {
        // Validate user, return JWT
        return { accessToken: 'mock-jwt-token' };
    }
}
