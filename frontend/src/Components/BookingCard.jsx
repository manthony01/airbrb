import { Paper } from '@mui/material';
import React from 'react';
export default function BookingCard (props) {
  return (
    <>
      <Paper elevation={12} sx={props.sx}>
        { props.children }
      </Paper>
    </>
  )
}
