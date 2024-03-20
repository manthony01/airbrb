import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import { getCall, putCall } from '../fetch';
import { reformatDate } from '../helpers';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';

export default function BookingHistory (props) {
  const { token, email, setToken } = props;
  const { listingId } = useParams();
  const [title, setTitle] = useState('');
  const [oldBookings, setOldBookings] = useState([]);
  const [requestedBookings, setRequestedBookings] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [onlineDays, setOnlineDays] = useState(null);

  useEffect(() => {
    const fetchAllData = async (token, listingId) => {
      try {
        const response = await getCall(`/listings/${listingId}`, token);
        const creationDate = new Date(response.listing.postedOn);
        const currentDate = new Date();
        const timeOnlineInMilliseconds = currentDate - creationDate;
        setOnlineDays(response.listing.postedOn === null ? 0 : Math.floor(timeOnlineInMilliseconds / (1000 * 60 * 60 * 24)));
        const allBookings = await getCall('/bookings', token);
        // array of bookings
        const bookingsData = allBookings.bookings || [];
        const filteredBookings = bookingsData.filter(booking => booking.listingId === `${listingId}`);
        const tempRequestedBookings = filteredBookings.filter(b => b.status === 'pending');
        const tempOldBooking = filteredBookings.filter(b => b.status !== 'pending');
        setOldBookings(tempOldBooking);
        setRequestedBookings(tempRequestedBookings);
        setTitle(response.listing.title);
      } catch (error) {
        console.error('Error in getting history data:', error);
      }
    };
    fetchAllData(token, listingId, email);
  }, [email, listingId, token]);

  const acceptBooking = async (booking) => {
    try {
      const token = localStorage.getItem('token');
      const passInBooking = { bookingId: booking.id, status: 'accepted' };
      await putCall(`/bookings/accept/${booking.id}`, passInBooking, token);

      const tempRequestedBookings = requestedBookings.filter(b => b.id !== booking.id);
      const tempOldBookings = [...oldBookings, { ...booking, status: 'accepted' }];

      setRequestedBookings(tempRequestedBookings);
      setOldBookings(tempOldBookings);
    } catch (error) {
      console.error('Error accepting booking', error);
    }
  };

  const declineBooking = async (booking) => {
    try {
      const token = localStorage.getItem('token');
      const passInBooking = { bookingId: booking.id, status: 'declined' };
      await putCall(`/bookings/decline/${booking.id}`, passInBooking, token);

      const tempRequestedBookings = requestedBookings.filter(b => b.id !== booking.id);
      const tempOldBookings = [...oldBookings, { ...booking, status: 'declined' }];

      setRequestedBookings(tempRequestedBookings);
      setOldBookings(tempOldBookings);
    } catch (error) {
      console.error('Error declining booking', error);
    }
  };

  const currentYear = new Date().getFullYear();
  // Filter bookings for the current year and accepted status
  const acceptedBookingsThisYear = oldBookings.filter(
    b => b.status === 'accepted' && new Date(b.dateRange.start).getFullYear() === currentYear
  );
  // Calculate total earnings
  const totalEarningsThisYear = acceptedBookingsThisYear.reduce(
    (total, booking) => total + parseInt(booking.totalPrice),
    0
  );
  const earningsThisYear = totalEarningsThisYear.toFixed(2);

  // calculate number of days booked this year
  const daysBookedThisYear = oldBookings
    .filter(b => b.status === 'accepted' && new Date(b.dateRange.start).getFullYear() === currentYear)
    .map(b => {
      const thisYear = new Date().getFullYear();
      const startDate = new Date(b.dateRange.start);
      const endDate = new Date(b.dateRange.end);

      const getDaysInRange = (start, end) => Math.round((end - start) / (1000 * 60 * 60 * 24));

      if (startDate.getFullYear() === thisYear && endDate.getFullYear() === thisYear) {
        return getDaysInRange(startDate, endDate);
      } else if (startDate.getFullYear() === thisYear) {
        return getDaysInRange(startDate, new Date(thisYear, 11, 31));
      } else if (endDate.getFullYear() === thisYear) {
        return getDaysInRange(new Date(thisYear, 0, 0), endDate);
      }
      return 0;
    })
    .reduce((totalDays, days) => totalDays + days, 0);

  return (
    <>
      <NavBar token={token} setToken={setToken}/>
      <br />
      <h1 className="text">Here are the status: {title}</h1>
      <br />
      <div>
        Online for: {onlineDays !== null ? onlineDays : 'N/A'} days
      </div>
      <div>
        Earnings this year: ${earningsThisYear}
      </div>
      <div>
        Days booked this year: {daysBookedThisYear}
      </div>
      <br />
      <Button variant='outlined' startIcon={<HistoryIcon />} onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? <>Pending status Bookings</> : <>All Booking History</>}
      </Button>
      <br />
      <br />
      {showHistory
        ? <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '10px', border: '1px solid #ddd' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>User</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Check In</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Check Out</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price ($)</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {oldBookings.map((b, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{b.owner}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reformatDate(b.dateRange.start)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reformatDate(b.dateRange.end)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{b.totalPrice}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        : (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '10px', border: '1px solid #ddd' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>User</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Check In</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Check Out</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price ($)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Accept Request?</th>
              </tr>
            </thead>
            <tbody>
              {requestedBookings.map((b, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{b.owner}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reformatDate(b.dateRange.start)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reformatDate(b.dateRange.end)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{b.totalPrice}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <Button color="success" variant='outlined' startIcon={<CheckIcon />} onClick={() => acceptBooking(b)}>
                      Accept
                    </Button>
                    <span> </span>
                    <Button color="error" variant='outlined' startIcon={<ClearIcon />} onClick={() => declineBooking(b)}>
                      Decline
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </>
  );
}
