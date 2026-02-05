'use client';

import { useState } from 'react';
import { createBooking } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function BookingForm({ event }: { event: any }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleBook = async () => {
        setLoading(true);
        try {
            // Hardcoded userId and seatId for demo
            const userId = 'user-123';
            const seatId = `seat-${Math.floor(Math.random() * 100)}`;

            const result = await createBooking(String(event.id), userId, seatId);

            if (result.status === 'success' || result.status === 'pending') {
                alert(`Booking Successful! Order ID: ${result.orderId}`);
                router.push('/');
            } else {
                alert('Booking Failed: ' + result.message);
            }
        } catch (e) {
            alert('Error booking ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-bold mb-4">Select a Seat</h3>
            <div className="h-48 bg-gray-200 mb-4 flex items-center justify-center rounded">
                <span className="text-gray-500">Venue Map Placeholder</span>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold">Standard Ticket</p>
                    <p className="text-gray-500">$50.00</p>
                </div>
                <button
                    onClick={handleBook}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Book Now'}
                </button>
            </div>
        </div>
    );
}
