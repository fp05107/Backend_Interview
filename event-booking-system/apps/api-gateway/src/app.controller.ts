import { Controller, Get, Post, Body, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateEventDto, CreateBookingDto } from '@app/shared';

@Controller()
export class AppController {
    constructor(
        @Inject('AUTH_SERVICE') private authClient: ClientProxy,
        @Inject('EVENT_SERVICE') private eventClient: ClientProxy,
        @Inject('BOOKING_SERVICE') private bookingClient: ClientProxy,
    ) { }

    @Post('auth/register')
    register(@Body() body: any) {
        return this.authClient.send({ cmd: 'register' }, body);
    }

    @Post('auth/login')
    login(@Body() body: any) {
        return this.authClient.send({ cmd: 'login' }, body);
    }

    @Post('events')
    createEvent(@Body() dto: CreateEventDto) {
        return this.eventClient.send({ cmd: 'create_event' }, dto);
    }

    @Get('events')
    getEvents() {
        return this.eventClient.send({ cmd: 'get_events' }, {});
    }

    @Get('events/:id')
    getEvent(@Param('id') id: string) {
        return this.eventClient.send({ cmd: 'get_event' }, { id });
    }

    @Post('bookings')
    createBooking(@Body() dto: CreateBookingDto) {
        // For RabbitMQ/Event-based, we often use 'emit' for fire-and-forget or 'send' for request-response.
        // User requirement: "Publish an event BOOKING_CONFIRMED".
        // Initial request is likely HTTP -> Gateway. Gateway might send a command to Booking Service to START the process.
        // Let's use 'send' to get an acknowledgment that the process started, or just 'emit'.
        // Given the flow "check Redis... create Pending... publish", this sounds like a command.
        return this.bookingClient.send({ cmd: 'create_booking' }, dto);
    }
}
