import { RmqContext } from '@nestjs/microservices';
import { CreateBookingDto } from '@app/shared';
export declare class AppController {
    private redisMock;
    private rabbitClient;
    constructor();
    createBooking(dto: CreateBookingDto, context: RmqContext): Promise<{
        status: string;
        message: string;
        orderId?: undefined;
    } | {
        status: string;
        orderId: string;
        message?: undefined;
    }>;
}
