import React from 'react';
import {
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { encodeImage } from '../helpers';
import { postCall } from '../fetch';
import CancelIcon from '@mui/icons-material/Cancel';
import styled from '@emotion/styled';

export default function CreateListingModal (props) {
  const fetchHostListings = props.fetchHostListings;
  const token = props.token;
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [suburb, setSuburb] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [city, setCity] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('apartment');
  const [bathrooms, setBathrooms] = React.useState('');
  const initBed = { type: 'single', quantity: '0' };
  const initBedroom = [[initBed]];
  const [bedroomsProperty, setBedroomsProperty] = React.useState(initBedroom);
  const [amenities, setAmenities] = React.useState('');
  const CreateListingButton = styled('button')({
    marginLeft: 'auto',
    marginBottom: '20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    outline: 'none',
  });

  const StyledDivider = styled(Divider)({
    margin: '20px 0',
  })

  const modalBackground = {
    position: 'relative',
    bgcolor: 'background.paper',
    boxShadow: 24,
  };

  const handleClose = () => {
    setOpen(false);
  }
  const handleOpen = () => {
    setBedroomsProperty(initBedroom);
    setOpen(true);
  }
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const metaData = {
        propertyType,
        bathrooms,
        amenities,
        bedroomsProperty,
        additionalPhotos: [],
      };

      const address = {
        street,
        suburb,
        postcode,
        city,
        country,
      }
      const body = {
        title,
        address,
        price,
        thumbnail,
        metadata: metaData,
      };
      await postCall('/listings/new', body, token)
      // on success, close modal and render new changes
      fetchHostListings();
      handleClose();
    } catch (e) {
      alert(e);
    }
  };

  const handleThumbnail = async (e) => {
    const imageUrl = e.target.files[0];
    const image = await encodeImage(imageUrl);
    setThumbnail(image);
  }

  const addBed = (bedroomKey) => {
    const bedrooms = [...bedroomsProperty];
    bedrooms[bedroomKey].push(initBed);
    setBedroomsProperty(bedrooms);
  }
  const addBedroom = () => {
    const bedrooms = [...bedroomsProperty];
    bedrooms.push([initBed]);
    setBedroomsProperty(bedrooms);
  }
  const removeBed = (bedroomKey, bedKey) => {
    const bedrooms = [...bedroomsProperty];
    bedrooms[bedroomKey].splice(bedKey, 1)
    setBedroomsProperty(bedrooms);
  }
  const removeBedroom = (key) => {
    const bedrooms = [...bedroomsProperty];
    bedrooms.splice(key + 1, 1);
    setBedroomsProperty(bedrooms);
  }

  return (
    <>
      <CreateListingButton onClick={handleOpen}>Create Listing</CreateListingButton>
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
        sx={{
          display: 'block',
          overflow: 'auto',
        }}
      >
        <Fade in={open}>
          <Grid container justifyContent="center" alignItems="center" height="100%">
            <Paper style={modalBackground} square={false} variant="outlined"
              sx={{ padding: '20px' }}
            >
              <Grid
                container
                justifyContent="center"
                alignItems="center"
              >
                <form>
                  <Typography variant="h4">Create listing here!</Typography>
                  <StyledDivider/>
                  <div>
                    <div>Title</div>
                    <input
                      id="create-listing-title"
                      aria-describedby="my-helper-text"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <div> Street </div>
                    <input
                      id="create-listing-address"
                      aria-describedby="my-helper-text"
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>
                  <div>
                    <div> Suburb </div>
                    <input
                      id="create-listing-address"
                      aria-describedby="my-helper-text"
                      onChange={(e) => setSuburb(e.target.value)}
                    />
                  </div>
                  <div>
                    <div> Postcode </div>
                    <input
                      id="create-listing-address"
                      aria-describedby="my-helper-text"
                      onChange={(e) => setPostcode(e.target.value)}
                    />
                  </div>
                  <div>
                    <div> City </div>
                    <input
                      id="create-listing-address"
                      aria-describedby="my-helper-text"
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <div> Country </div>
                    <input
                      id="create-listing-address"
                      aria-describedby="my-helper-text"
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                  <div>
                    <div> Price per night </div>
                    <input
                      type="number"
                      label="Price per night"
                      id="create-listing-price"
                      aria-describedby="my-helper-text"
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <div> Listing thumbnail </div>
                    <input type='file' id='create-listing-thumbnail' onChange={ handleThumbnail }/>
                  </div>
                  <div>
                    <div>Type</div>
                    <select onChange = {e => setPropertyType(e.target.value)}>
                      <option value="apartment">Apartment</option>
                      <option value="unit">Unit</option>
                      <option value="house">House</option>
                    </select>
                  </div>
                  <div>
                    <div>Number of bathrooms</div>
                    <input
                      type="number"
                      id="create-listing-bathrooms"
                      aria-describedby="my-helper-text"
                      onChange={(e) => setBathrooms(e.target.value)}
                    />
                  </div>
                  <div>
                    <div>Bedroom properties</div>
                    <StyledDivider/>
                    {
                      bedroomsProperty.map((bedroom, bedroomKey) => {
                        return (
                          <div key={bedroomKey}>
                            <div> Bedroom {bedroomKey + 1}
                              {
                                (bedroomKey !== 0) && <IconButton title="Remove bedroom" onClick={e => removeBedroom(bedroomKey - 1)}><CancelIcon/></IconButton>
                              }
                            </div>
                            {
                              Array.from(bedroom).map((bed, bedKey) => {
                                return <div key={bedKey}>
                                  <div style={{ display: 'inline-block' }}>
                                    <div>Type</div>
                                    <select
                                      value={bedroomsProperty[bedroomKey][bedKey].type}
                                      onChange={ e => {
                                        const bedrooms = [...bedroomsProperty];
                                        bedrooms[bedroomKey][bedKey].type = e.target.value;
                                        setBedroomsProperty(bedrooms);
                                      }}
                                    >
                                      <option value="single">Single</option>
                                      <option value="double">Double</option>
                                      <option value="queen">Queen</option>
                                      <option value="king">King</option>
                                    </select>
                                  </div>
                                  <div style={{ display: 'inline-block' }}>
                                    <div>Quantity</div>
                                    <input type="number" onChange={e => {
                                      const bedrooms = [...bedroomsProperty];
                                      bedrooms[bedroomKey][bedKey].quantity = e.target.value;
                                      setBedroomsProperty(bedrooms);
                                    }}
                                    value={bedroomsProperty[bedroomKey][bedKey].quantity}
                                    />
                                  </div>
                                  {
                                    (bedKey !== 0) && <IconButton title="Remove bed" onClick={e => removeBed(bedroomKey, bedKey)}>
                                      <CancelIcon/>
                                    </IconButton>
                                  }
                                </div>
                              })
                            }
                            <br/>
                            <Button variant="outlined" size="small" onClick={e => addBed(bedroomKey)}> Add bed </Button>

                            <StyledDivider/>
                          </div>
                        );
                      })
                    }
                    <Button variant="outlined" size="small" onClick={addBedroom}> Add bedroom </Button>
                  </div>
                  <div>
                    <div> Amenities </div>
                    <input
                      type="text"
                      placeholder=""
                      label="Property Amenities"
                      id="create-listing-amenities"
                      aria-describedby="my-helper-text"
                      onChange={(e) => setAmenities(e.target.value)}
                    />
                  </div>
                  <StyledDivider/>
                  <Button type="submit" variant="contained" onClick={(e) => handleSubmit(e)}>
                    SUBMIT
                  </Button>
                </form>
              </Grid>
            </Paper>
          </Grid>
        </Fade>
      </Modal>
    </>
  );
}
