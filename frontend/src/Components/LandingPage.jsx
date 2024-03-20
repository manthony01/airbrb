import React from 'react';
import { getCall } from '../fetch';
import ListingCard from './ListingCard';
import { Grid, Typography } from '@mui/material';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { computeAverageRating, isDateInRange } from '../helpers';

function LandingPage (props) {
  const token = props.token;
  const setToken = props.setToken;
  const email = localStorage.getItem('email');
  const [allListings, setAllListings] = React.useState([]);
  const [filterType, setFilterType] = React.useState(null);
  const navigate = useNavigate();
  const allFilterTypes = {
    search: '',
    bedrooms: {
      min: 0,
      max: 0,
    },
    price: {
      min: 0,
      max: 0
    },
    dates: {
      min: 0,
      max: 0,
    },
    ratings: '',
  };
  const [filterParameters, setFilterParameters] = React.useState(allFilterTypes);

  const filterFunction = (listing) => {
    if (!listing.published) {
      return false;
    }
    if (filterType === 'search') {
      const search = filterParameters.search.toLowerCase();
      return listing.title.toLowerCase().includes(search) || listing.address.city.toLowerCase().includes(search);
    } else if (filterType === 'bedrooms') {
      const bedrooms = listing.metadata.bedroomsProperty.length;
      return bedrooms >= filterParameters.bedrooms.min &&
        bedrooms <= filterParameters.bedrooms.max;
    } else if (filterType === 'price') {
      const price = parseInt(listing.price);
      return price >= filterParameters.price.min &&
        price <= filterParameters.price.max;
    } else if (filterType === 'dates') {
      // need to check availability dates
      const { min, max } = filterParameters.dates
      const listingAvailabilities = listing.availability;
      const validListing = listingAvailabilities
        .find(({ start, end }) => isDateInRange(min, max, start, end));
      return validListing;
    } else {
      return true;
    }
  }
  React.useEffect(() => {
    const fetchAllListings = async () => {
      try {
        let bookingsList = [];
        // get bookings
        if (token !== null) {
          const { bookings } = await getCall('/bookings', token);
          bookingsList = bookings;
        }

        // get listing ids the user has made bookings for.
        const userBookings = bookingsList
          .filter(b => b.email === email)
          .map(b => b.listingId);

        // get all listings
        const { listings } = await getCall('/listings', token);
        const listingPromises = listings.map(async (listing) => {
          const result = await getCall(`/listings/${listing.id}`);
          // add listing id to result
          result.listing.id = listing.id;
          return result;
        });

        const listingsWithMetaData = await Promise.all(listingPromises);
        // sort listing ids by pending and accepted bookings first
        const sortedListings = listingsWithMetaData
          .map(res => {
            return res.listing;
          })
          .sort((a, b) => {
            if (filterType !== 'ratings') {
              if (userBookings.includes(a.id) && !userBookings.includes(b.id)) {
                return -1;
              } else if (!userBookings.includes(a.id) && userBookings.includes(b.id)) {
                return 1;
              }
              if (a.title < b.title) { return -1; }
              if (a.title > b.title) { return 1; }
              return 0;
            } else {
              const averageA = computeAverageRating(a.reviews);
              const averageB = computeAverageRating(b.reviews);
              const sortByIncreasingRating = () => {
                if (averageA > averageB) {
                  return 1;
                } else if (averageA < averageB) {
                  return -1;
                } else {
                  return 0;
                }
              }
              return (filterParameters.ratings === 'increasing')
                ? sortByIncreasingRating()
                : -sortByIncreasingRating();
            }
          });
        setAllListings(sortedListings);
      } catch (e) {
        alert(e);
      }
    }
    fetchAllListings();
  }, [token, email, filterType, filterParameters.ratings])
  return (
    <>
      <NavBar token={token} setToken={setToken}
        onLandingPage
        setFilterParameters={setFilterParameters}
        filterParameters={filterParameters}
        setFilterType={setFilterType}
      />
      {
        filterType !== null &&
          <Typography variant="h4">Filtered by: {filterType}</Typography>
      }
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3} sx={{ padding: '24px' }}>
        {
          allListings.length === 0
            ? <h1> No listings have been made yet </h1>
            : allListings
              .filter(filterFunction)
              .map((l, index) => {
                return (
                  <Grid
                    item
                    key={index}
                    xs={4} sm={4} md={4}
                    onClick={ e => navigate(`/listing/${l.id}`, { state: { filterType, filterParameters } })}
                  >
                    <ListingCard listing={ l } />
                  </Grid>
                );
              })
        }
      </Grid>
    </>
  )
}

export default LandingPage;
