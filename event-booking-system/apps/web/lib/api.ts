const API_URL = 'http://localhost:3001';

export async function getEvents() {
    const res = await fetch(`${API_URL}/events`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
}

export async function getEvent(id: string) {
    const res = await fetch(`${API_URL}/events/${id}`, { cache: 'no-store' });
    if (!res.ok) return null; // Handle 404 gracefully
    return res.json();
}

export async function createBooking(eventId: string, userId: string, seatId: string) {
    const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, userId, seatId }),
    });
    if (!res.ok) throw new Error('Booking failed');
    return res.json();
}
