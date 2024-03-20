import React from 'react';
import NavBar from './NavBar';
import ReviewsModal from './ReviewsModal';
import { getCall, postCall } from '../fetch';
import { useParams, useLocation } from 'react-router-dom';
import { Backdrop, Box, Button, Divider, Fade, FormControl, Grid, InputLabel, Modal, TextField, Typography, styled } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import BookingCard from './BookingCard';
import { addressString, computeAverageRating, computeBedCount, computeTripLength, isDateInRange } from '../helpers';
import UserBookingTable from './UserBookingTable';
import MoreListingPhotosModal from './MoreListingPhotosModal';

export default function UserSelectedListing (props) {
  const { listingId } = useParams();
  const location = useLocation();
  const { filterType, filterParameters } = location.state || {};
  const { token, setToken } = props;
  const [listingData, setListingData] = React.useState('');
  const [checkinDate, setCheckinDate] = React.useState('');
  const [checkoutDate, setCheckoutDate] = React.useState('');
  const [userBookings, setUserBookings] = React.useState(null);
  const [openReviews, setOpenReviews] = React.useState(false);
  const isLoading = !(listingData && listingData.metadata && listingData.metadata.bedroomsProperty && listingData.address);
  const metadata = (listingData == null || listingData.metadata == null) ? null : listingData.metadata;
  const email = localStorage.getItem('email');
  const ReviewsLink = styled('button')(
    `
      background: none;
      border: none;
      font-size: 1em;
      text-decoration: underline;
      &:hover {
        cursor: pointer;
      }
    `,

  );

  const StyledDivider = styled(Divider)({
    margin: '20px 0',
  });
  const StyledStarIcon = styled(StarIcon)({
    fontSize: '1em',
    position: 'relative',
    top: '3px',
  })

  const ListingInfoSection = styled('div')(({ theme }) => ({
    width: '63%',
    [theme.breakpoints.down('lg')]: {
      width: '100%',
      marginBottom: '200px',
    },
  }));

  const BookingSection = styled('div')(({ theme }) => ({
    width: '33%',
    [theme.breakpoints.down('lg')]: {
      width: '100%',
      height: '200px',
      position: 'fixed',
      left: 0,
      bottom: 0,
    },
  }));

  const StyledFormControl = styled(FormControl)({
    padding: '10px 0',
  })
  const StyledInputLabel = styled(InputLabel)({
    position: 'relative',
    left: '-10px',
    top: '-15px',
  })

  const handleBooking = (e) => {
    if (checkinDate === '' || checkoutDate === '') {
      alert('Please enter check in and checkout dates');
      return;
    }
    const createNewBooking = async () => {
      try {
        const anyAvailability = listingData.availability.find(({ start, end }) => isDateInRange(checkinDate, checkoutDate, start, end));
        if (!anyAvailability) {
          alert('Listing is not available during this time frame');
          return;
        }
        const dateRange = {
          start: checkinDate,
          end: checkoutDate
        }

        const totalPrice = computeTripLength(checkinDate, checkoutDate) * listingData.price;
        const body = {
          dateRange,
          totalPrice,
        }
        await postCall(`/bookings/new/${listingId}`, body, token);
        // if successfull, give user temporary notification of the booking success
        alert('Booking has succesfully been made!');
        const fetchUserBookingData = async () => {
          try {
            const { bookings } = await getCall('/bookings', token);
            const userBookings = bookings.filter(booking => booking.owner === email && booking.listingId === listingId);
            setUserBookings(userBookings);
          } catch (e) {
            alert(e);
          }
        }
        fetchUserBookingData();
      } catch (e) {
        alert(e);
      }
    }
    createNewBooking();
  }
  const reviewsAndRatingString = (!isLoading && listingData.reviews.length !== 0)
    ? <>
      <span>{ computeAverageRating(listingData.reviews) } rating </span>
      <span> | total reviews: { listingData.reviews.length} </span>
    </>
    : <span> no reviews yet </span>
  const bedAndBathroomString = (!isLoading) &&
    `bedrooms: ${listingData.metadata.bedroomsProperty.length} | beds: ${computeBedCount(listingData.metadata.bedroomsProperty)} | bathrooms: ${listingData.metadata.bathrooms} `

  const handleReviewModal = (e) => {
    setOpenReviews(true);
  };

  const computeStayPrice = (pricePerNight) => {
    const startDate = new Date(checkinDate);
    const endDate = new Date(checkoutDate);
    const diffTime = Math.abs(startDate - endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * pricePerNight;
  }

  const fetchAllData = async (token, listingId, email) => {
    try {
      const response = await getCall(`/listings/${listingId}`, token);
      setListingData(response.listing);
      const { bookings } = await getCall('/bookings', token);
      const userBookings = bookings.filter(booking => booking.owner === email && booking.listingId === listingId);
      setUserBookings(userBookings);
    } catch (e) {
      alert(e);
    }
  }

  React.useEffect(() => {
    fetchAllData(token, listingId, email);
    const setPricePerNight = (filterType) => {
      if (filterType === 'dates') {
        setCheckinDate(filterParameters.dates.min)
        setCheckoutDate(filterParameters.dates.max)
      }
    }
    setPricePerNight(filterType);
  }, [listingId, token, email, filterType, filterParameters.dates.min, filterParameters.dates.max])
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <NavBar token={token} setToken={setToken}/>
      {
        (isLoading)
          ? <h1> Loading... </h1>
          : <Grid
            container
            justifyContent='center'
            sx={{
              width: '100%',
              padding: '10px 0'
            }}
          >
            <Box
              className="whole-page"
              sx={{
                boxSizing: 'border-box',
                padding: '0 20px',
                width: '100%',
                maxWidth: 1300,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  padding: '10px 0'
                }}
              >
                {listingData.title}
              </Typography>
              <div>
                <Box
                  component="img"
                  alt="listing thumbnail" src={listingData.thumbnail}
                  sx={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '15px'
                  }}
                >
                </Box>
                <Grid
                  container
                  justifyContent='flex-end'
                >
                  <MoreListingPhotosModal
                    additionalPhotos={metadata.additionalPhotos}
                    style={{
                      position: 'relative',
                      top: '-50px',
                      backgroundColor: 'white'
                    }}
                  />
                </Grid>
              </div>
              <Grid
                container
                justifyContent="space-between"
                sx={{
                  margin: '20px 0',
                }}
              >

                <ListingInfoSection>
                  {
                    <Typography variant="h4"> {metadata.propertyType} on {addressString(listingData.address)}</Typography>
                  }
                  {
                    <Typography variant="body2">
                      {bedAndBathroomString}
                    </Typography>
                  }
                  <br/>
                  <Typography variant="body1">
                    <StyledStarIcon/>
                    <ReviewsLink onClick={ handleReviewModal }>
                      {reviewsAndRatingString}
                    </ReviewsLink>
                  </Typography>
                  <StyledDivider/>

                  <Typography variant="h5">Amenities include:</Typography>
                  <Typography variant="body2">{metadata.amenities}</Typography>
                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openReviews}
                    onClose={e => setOpenReviews(false)}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                      backdrop: {
                        timeout: 500,
                      },
                    }}
                  >
                    <Fade in={openReviews}>
                      <Box>
                        <ReviewsModal setOpenReviewModal={setOpenReviews} openReviewModal={openReviews} reviews={listingData.reviews}/>
                      </Box>
                    </Fade>
                  </Modal>
                  <StyledDivider/>
                  {
                    !token
                      ? <Typography variant="h4"> Log in now to make a booking today! </Typography>
                      : <>
                        <Typography variant="h4"> Already made a booking? Check below.</Typography>
                      </>
                  }
                  {
                    (token && userBookings) &&
                      <>
                        <UserBookingTable userBookings={userBookings} listingId={listingId} token={token}
                          fetchAllData={fetchAllData}
                        />
                      </>
                  }
                </ListingInfoSection>
                <BookingSection>
                  <BookingCard sx={{ padding: '20px' }}>
                    {
                      (filterType === 'dates')
                        ? <Typography variant="h4">
                          ${computeStayPrice(listingData.price)} per stay
                        </Typography>
                        : <Typography variant="h4">
                          ${listingData.price} per night
                        </Typography>
                    }
                    <Grid
                      container
                      justifyContent="space-between"
                    >
                      <StyledFormControl>
                        <StyledInputLabel required> CHECK-IN </StyledInputLabel>
                        <TextField type="date"
                          value={checkinDate}
                          onChange={e => setCheckinDate(e.target.value)}
                        />
                      </StyledFormControl>
                      <StyledFormControl>
                        <StyledInputLabel required> CHECK-OUT </StyledInputLabel>
                        <TextField type="date" value={checkoutDate} onChange={e => setCheckoutDate(e.target.value)}/>
                      </StyledFormControl>
                    </Grid>
                    <Button variant="contained" onClick={handleBooking}> Make Booking </Button>
                  </BookingCard>
                </BookingSection>
              </Grid>
            </Box>
          </Grid>
      }
    </div>
  );
}
