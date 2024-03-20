import React, { useState } from 'react';
import {
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import styled from '@emotion/styled';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { putCall } from '../fetch';

const StyledDivider = styled(Divider)({
  padding: '10px 0',
})

const modalBackground = {
  position: 'relative',
  width: '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
};

export default function PublishListingModal (props) {
  const token = localStorage.getItem('token');
  const listingId = props.listingId;
  const fetchListings = props.fetchListings;
  const [open, setOpen] = useState(false);
  const initEntry = [{ start: '', end: '', }];
  const [availabilities, setAvailabilities] = useState(initEntry);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePublishListing = async (e) => {
    try {
      const availableDates = availabilities;
      const body = {
        availability: availableDates
      }
      await putCall(`/listings/publish/${listingId}`, body, token);
      // upon success notify user
      fetchListings()
      alert('listing has been published');
      handleClose();
    } catch (e) {
      alert(e);
    }
  }

  const removeAvailabilityRange = (e, key) => {
    const currentList = [...availabilities];
    currentList.splice(key, 1);
    setAvailabilities(currentList);
  }
  const addAvailabilityRange = (e) => {
    const currentList = [...availabilities];
    const newRange = {
      start: '',
      end: '',
    }
    currentList.push(newRange);
    setAvailabilities(currentList);
  }

  return (
    <>
      <Button variant="contained" onClick={handleOpen}> Publish </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Grid container justifyContent="center" alignItems="center" height="100%">
            <Paper
              style={modalBackground} square={false} variant="outlined"
              sx={{
                width: '70%'
              }}
            >
              <form style={{ padding: 20 }} onSubmit={(e) => e.preventDefault()}>
                <Typography variant="h4">Publish Listing</Typography>
                <Divider/>
                <Typography variant="h5">Enter availabilities below</Typography>
                <Grid
                  sx={{
                    padding: '10px 0'
                  }}
                >
                  {
                    availabilities.map((dateRange, key) => {
                      return <div key={key}>
                        <Grid
                          container
                          sx={{
                            width: '100%',
                            padding: '10px 0',
                          }}
                          alignItems='center'
                        >
                          <Grid item>
                            <Typography variant="body2">Start date</Typography>
                            <input
                              type="date"
                              aria-describedby="my-helper-text"
                              onChange={e => {
                                const current = [...availabilities];
                                current[key].start = e.target.value;
                                setAvailabilities(current);
                              }}
                            />
                          </Grid>
                          <Grid item>
                            <Typography variant="body2">End date</Typography>
                            <input
                              type="date"
                              aria-describedby="my-helper-text"
                              onChange={e => {
                                const current = [...availabilities];
                                current[key].end = e.target.value;
                                setAvailabilities(current);
                              }}
                            />
                          </Grid>
                          {
                            (key !== 0) &&
                            <IconButton aria-label="delete" onClick={e => removeAvailabilityRange(e, key)}>
                              <CancelIcon/>
                            </IconButton>
                          }
                        </Grid>
                      </div>
                    })

                  }
                </Grid>
                <AddCircleOutlineIcon onClick={addAvailabilityRange}/>
                <StyledDivider/>
                <Button type="submit" variant="contained" onClick={(e) => handlePublishListing(e)}>
                  SUBMIT
                </Button>
              </form>
            </Paper>
          </Grid>
        </Fade>
      </Modal>
    </>
  )
}
