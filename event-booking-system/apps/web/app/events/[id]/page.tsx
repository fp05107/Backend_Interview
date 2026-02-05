import { getEvent } from '@/lib/api';
import BookingForm from '@/components/BookingForm';

export default async function EventPage({ params }: { params: { id: string } }) {
    const event = await getEvent(params.id);

    if (!event) {
        return <div className="p-24 text-center">Event not found</div>;
    }

    return (
        <main className="min-h-screen p-24 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-md mb-6">
                    <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
                    <p className="text-gray-600 text-lg mb-6">{event.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold block">Date:</span>
                            {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div>
                            <span className="font-semibold block">Location:</span>
                            {event.location}
                        </div>
                        <div>
                            <span className="font-semibold block">Total Seats:</span>
                            {event.totalSeats}
                        </div>
                    </div>
                </div>

                <BookingForm event={event} />
            </div>
        </main>
    );
}
