import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ImageIcon from '@mui/icons-material/Image';
import { Backdrop, Divider, Fade, Grid, Paper, styled } from '@mui/material';
export default function MoreListingPhotosModal (props) {
  const additionalPhotos = props.additionalPhotos;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white',
    }
  }));

  const modalBackground = {
    position: 'relative',
    maxWidth: '1000px',
    width: '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
  };

  const StyledDivider = styled(Divider)({
    margin: '10px 0'
  })

  return (
    <>
      <StyledButton sx={props.style} variant="outlined" onClick={handleOpen}>View more <ImageIcon/></StyledButton>
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
            <Paper style={modalBackground} square={false} variant="outlined"
              sx={{ padding: '20px' }}
            >
              <Typography variant="h4">Additional Photos:</Typography>
              <StyledDivider/>
              {
                (additionalPhotos.length === 0)
                  ? <Typography variant="h5"> No photos </Typography>
                  : <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3} sx={{ padding: '24px' }}>
                    {
                      additionalPhotos.map((photo, key) => {
                        return <Grid item key={key}>
                          <Box
                            component="img"
                            sx={{
                              height: 233,
                              width: 350,
                              maxHeight: { xs: 233, md: 167 },
                              maxWidth: { xs: 350, md: 250 },
                            }}
                            alt="other listing"
                            src={photo}
                          />
                        </Grid>
                      })
                    }
                  </Grid>
              }
            </Paper>
          </Grid>
        </Fade>
      </Modal>
    </>
  );
}
