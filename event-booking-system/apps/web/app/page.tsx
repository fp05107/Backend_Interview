import { getEvents } from '@/lib/api';
import Link from 'next/link';

export default async function Home() {
  const events = await getEvents();

  return (
    <main className="min-h-screen p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event: any) => (
          <div key={event.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">{event.name}</h2>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>{new Date(event.date).toLocaleDateString()}</span>
              <span>{event.location}</span>
            </div>
            <Link
              href={`/events/${event.id}`}
              className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-center col-span-full">No events found. Check if backend is running.</p>
        )}
      </div>
    </main>
  );
}
