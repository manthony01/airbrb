import React from 'react';
import { render } from '@testing-library/react';
import UserBookingTable from '../Components/UserBookingTable';
import '@testing-library/jest-dom';

const userBookings = [
  {
    id: 1,
    dateRange: { start: '2023-11-16', end: '2023-11-17' },
    totalPrice: 999,
    status: 'accepted',
  }
];

describe('UserBookingTable Component', () => {
  test('Displays booking details in the table', () => {
    const { queryByText } = render(
      <UserBookingTable
        userBookings={userBookings}
        listingId="listingId"
        token="token"
        fetchAllData={() => {}}
      />
    );

    const bookingId = queryByText('1');
    expect(bookingId).toBeInTheDocument();
    const checkInDate = queryByText(/16\/11\/2023/);
    expect(checkInDate).toBeInTheDocument();
    const checkOutDate = queryByText(/17\/11\/2023/);
    expect(checkOutDate).toBeInTheDocument();
    const totalPrice = queryByText('$999');
    expect(totalPrice).toBeInTheDocument();
  });
});
