import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEventDto } from '@app/shared';

@Controller()
export class AppController {
    private events = []; // Mock DB for now

    @MessagePattern({ cmd: 'create_event' })
    createEvent(@Payload() dto: CreateEventDto) {
        const event = { id: this.events.length + 1, ...dto };
        this.events.push(event);
        console.log('Event Created', event);
        return event;
    }

    @MessagePattern({ cmd: 'get_events' })
    getEvents() {
        return this.events;
    }

    @MessagePattern({ cmd: 'get_event' })
    getEvent(@Payload() data: { id: string }) {
        return this.events.find(e => e.id === Number(data.id));
    }
}
