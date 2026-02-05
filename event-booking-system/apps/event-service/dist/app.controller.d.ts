import { CreateEventDto } from '@app/shared';
export declare class AppController {
    private events;
    createEvent(dto: CreateEventDto): {
        name: string;
        description: string;
        date: string;
        location: string;
        totalSeats: number;
        id: number;
    };
    getEvents(): any[];
    getEvent(data: {
        id: string;
    }): any;
}
