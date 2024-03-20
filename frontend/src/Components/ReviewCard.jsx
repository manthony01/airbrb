import React from 'react';
import { Divider, Paper, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export default function ReviewCard (props) {
  const review = props.review;
  return (
    <Paper
      sx={{
        padding: '20px',
        margin: '0 10px'
      }}
    >
      <Typography variant="h4">{review.owner}</Typography>
      <Typography variant="h5"><StarIcon/> {review.rating}</Typography>
      <Divider/>
      <Typography variant="h5">Comment: {review.comment}</Typography>
    </Paper>
  );
}
