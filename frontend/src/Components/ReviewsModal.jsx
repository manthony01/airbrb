import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import React from 'react';
import styled from '@emotion/styled';
import { Divider, Grid, Paper } from '@mui/material';
import ReviewCard from './ReviewCard';
import { computeAverageRating } from '../helpers';

export default function ReviewsModal (props) {
  const reviews = props.reviews;
  const StyledModal = styled(Paper)({
    maxWidth: '1100px',
    width: '85%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  })

  const StyledReviewSection = styled(Box)({
    width: '60%',
  })
  const StyledRatingSection = styled(Box)({
    width: '30%',
  })

  const StyledDivider = styled(Divider)({
    margin: '10px 0'
  })

  return (
    <StyledModal>
      <Grid
        container
        justifyContent="space-between"
        sx={{
          padding: '20px'
        }}
      >
        <StyledRatingSection>
          <Typography variant="h4"> Average Rating:</Typography>
          <Typography variant="h3"> <StarIcon/> {(reviews.length === 0) ? 'N/A' : computeAverageRating(reviews)}</Typography>
        </StyledRatingSection>
        <StyledReviewSection>
          <Typography variant="h3">
            {reviews.length} Review/s
          </Typography>
          <StyledDivider />
          {
            (reviews.length === 0)
              ? <Typography variant="h6"> No reviews yet</Typography>
              : reviews.map((review, key) => {
                return <ReviewCard key={key} review={review}></ReviewCard>;
              })
          }
        </StyledReviewSection>
      </Grid>
    </StyledModal>
  );
}
