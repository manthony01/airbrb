import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

export default function StarRating (props) {
  const activeStars = props.activeStars;
  const starsInt = parseFloat(activeStars).toFixed(1);
  return (
    <Box
      sx={{
        '& > legend': { mt: 2 },
        display: 'inline',
      }}
    >
      <Rating name="read-only" value={parseFloat(starsInt)} precision={0.1} readOnly />
    </Box>
  );
}
