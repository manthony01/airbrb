import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import React from 'react';
import styled from '@emotion/styled';
import { Divider, Grid, TextField } from '@mui/material';
import Slider from '@mui/material/Slider';
import { putCall } from '../fetch';

export default function CreateReviewModal (props) {
  const setOpenReviewModal = props.setOpenReviewModal;
  const bookingId = props.bookingId;
  const listingId = props.listingId;
  const token = props.token;
  const owner = props.owner;
  const fetchAllData = props.fetchAllData;
  const [rating, setRating] = React.useState(4);
  const [comment, setComment] = React.useState('');

  const StyledDivider = styled(Divider)({
    margin: '10px 0'
  })

  const handleClose = () => {
    setOpenReviewModal(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitReview = async () => {
      try {
        const review = {
          owner,
          rating,
          comment,
        }
        const body = {
          review
        }
        await putCall(`/listings/${listingId}/review/${bookingId}`, body, token);
        // upon success, notify user and close the modal
        const email = localStorage.getItem('email');
        fetchAllData(token, listingId, email)
        alert('Your review has been submitted. Thank you for rating your experience!');
        handleClose();
      } catch (e) {
        alert(e);
      }
    }
    submitReview();
  }

  const valuetext = (value) => {
    return `${value}Â°C`;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4">Write your review now!</Typography>
      <StyledDivider/>
      <Box
        sx={{
          padding: '0 20px'
        }}
      >
        <Typography variant="h6">Rating: {rating}/5</Typography>
        <Box sx={{ width: 300 }}>
          <Slider
            aria-label="Rating"
            defaultValue={4}
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={5}
            value={rating}
            onChange={e => setRating(e.target.value)}
          />
        </Box>
        <Typography variant="h6">Comment {'[optional]'}</Typography>
        <TextField
          type="text"
          fullWidth
          multiline
          maxRows={4}
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </Box>
      <StyledDivider/>
      <Grid
        container
        justifyContent="flex-end"
      >
        <Button type="submit" variant="contained">SUBMIT</Button>
      </Grid>

    </form>
  );
}
