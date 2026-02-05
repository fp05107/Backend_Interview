import { ClientProxy } from '@nestjs/microservices';
import { CreateEventDto, CreateBookingDto } from '@app/shared';
export declare class AppController {
    private authClient;
    private eventClient;
    private bookingClient;
    constructor(authClient: ClientProxy, eventClient: ClientProxy, bookingClient: ClientProxy);
    register(body: any): import("rxjs").Observable<any>;
    login(body: any): import("rxjs").Observable<any>;
    createEvent(dto: CreateEventDto): import("rxjs").Observable<any>;
    getEvents(): import("rxjs").Observable<any>;
    getEvent(id: string): import("rxjs").Observable<any>;
    createBooking(dto: CreateBookingDto): import("rxjs").Observable<any>;
}
