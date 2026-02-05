import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CreateBookingDto } from '@app/shared';

@Controller()
export class AppController {
    private redisMock = new Map<string, boolean>(); // Mocking Redis for demonstration
    private rabbitClient: ClientProxy;

    constructor() {
        // In a real app, inject this via Module
        this.rabbitClient = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://localhost:5672'],
                queue: 'events_queue', // Different queue for events
                queueOptions: { durable: false },
            },
        });
    }

    @MessagePattern({ cmd: 'create_booking' })
    async createBooking(@Payload() dto: CreateBookingDto, @Ctx() context: RmqContext) {
        const lockKey = `lock:event:${dto.eventId}:seat:${dto.seatId}`;

        // 1. Check Redis Lock
        if (this.redisMock.get(lockKey)) {
            return { status: 'failed', message: 'Seat already locked' };
        }
        this.redisMock.set(lockKey, true); // Set lock (expires in real implementation)

        // 2. Create Pending Order (Mock DB)
        console.log('Creating pending order in DB...', dto);
        const orderId = 'order-' + Math.floor(Math.random() * 1000);

        // 3. Publish Event
        this.rabbitClient.emit('BOOKING_CONFIRMED', {
            orderId,
            ...dto,
            timestamp: new Date(),
        });

        return { status: 'pending', orderId };
    }
}
