import { CardActionArea, Grid } from '@mui/material';
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { computeAverageRating } from '../helpers';
import StarRating from './StarRating';

function ListingCard (props) {
  const listing = props.listing;
  const averageRating = computeAverageRating(listing.reviews);
  return (
    <Card>
      <CardActionArea sx={{ height: 300 }}>
        <CardMedia
          component="img"
          image={listing.thumbnail}
          height="50%"
          alt="listing thumbnail"
        />
        <CardContent>
          <Typography gutterBottom variant="h8" component="div">
            Title: { listing.title }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reviews: { listing.reviews.length }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ${ listing.price } / night
          </Typography>
          <Grid
            container
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              {averageRating}
            </Typography>
            <StarRating activeStars={averageRating}/>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ListingCard;
