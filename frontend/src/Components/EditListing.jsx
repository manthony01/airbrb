import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCall, putCall } from '../fetch';
import { IconButton, Button, Divider, Input, InputLabel, Typography, Box, Grid, Paper, styled } from '@mui/material';
import BasicFormControl from './BasicFormControl';
import { encodeImage, fileToDataUrl } from '../helpers';
import NavBar from './NavBar';
import CancelIcon from '@mui/icons-material/Cancel';

export default function EditListing (props) {
  const { listingId } = useParams();
  const token = props.token;
  const setToken = props.setToken;
  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('house');
  const [bathrooms, setBathrooms] = React.useState('');
  const [amenities, setAmenities] = React.useState('');
  const [additionalPhotos, setAdditionalPhotos] = React.useState([]);
  const [street, setStreet] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [suburb, setSuburb] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [city, setCity] = React.useState('');
  const initBed = { type: 'single', quantity: '0' };
  const initBedroom = [[initBed]];
  const [bedroomsProperty, setBedroomsProperty] = React.useState(initBedroom);
  const navigate = useNavigate();

  const StyledDivider = styled(Divider)({
    margin: '20px 0',
  })

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
    bedrooms.splice(key, 1);
    setBedroomsProperty(bedrooms);
  }

  React.useEffect(() => {
    const fetchListing = async () => {
      const { listing } = await getCall(`/listings/${listingId}`, token);
      setTitle(listing.title);
      const address = listing.address;
      setStreet(address.street);
      setCity(address.city);
      setSuburb(address.suburb);
      setPostcode(address.postcode);
      setCountry(address.country);
      setPrice(listing.price);
      const metadata = listing.metadata;
      setPropertyType(metadata.propertyType);
      setBathrooms(metadata.bathrooms);
      setBedroomsProperty(metadata.bedroomsProperty);
      setAmenities(metadata.amenities);
    }
    fetchListing();
  }, [listingId, token])

  const handleSubmit = (e) => {
    e.preventDefault();
    const metadata = {
      propertyType,
      bathrooms,
      amenities,
      bedroomsProperty,
      additionalPhotos,
    }
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
      metadata
    }
    putCall(`/listings/${listingId}`, body, token)
      .then(success => {
        navigate('/listings');
      })
      .catch(e => console.log(e))
  }

  const handleThumbnail = async (e) => {
    const imageUrl = e.target.files[0];
    const image = await encodeImage(imageUrl);
    setThumbnail(image);
  }

  const handleAdditionalPhotos = (e) => {
    const photos = e.target.files;
    const encodeImages = async () => {
      try {
        const additionalImages = [];
        for (const photo of photos) {
          const bitEncoding = await fileToDataUrl(photo);
          additionalImages.push(bitEncoding);
        }
        setAdditionalPhotos(additionalImages);
      } catch (e) {
        alert(e);
      }
    }
    encodeImages();
  }
  return (
    <div>
      <NavBar token={token} setToken={setToken}/>
      <Grid
        sx={{
          paddingTop: '20px'
        }}
        container
        justifyContent="center"
        alignItems="center"
      >
        <Paper
          elevation={8}
          sx={{
            padding: '20px',
            width: '80%',
            maxWidth: '500px',
          }}
        >
          <form onSubmit={ e => handleSubmit(e) }>
            <Typography variant="h4">Edit Listing now!</Typography>
            <BasicFormControl variant='standard' margin='normal' size='small'>
              <InputLabel htmlFor='edit-listing-title'>Title</InputLabel>
              <Input value={ title } id='edit-listing-title' onChange={e => setTitle(e.target.value)}/>
            </BasicFormControl>
            <BasicFormControl variant='standard' margin='normal' size='small'>
              <InputLabel htmlFor='edit-listing-address'> Street </InputLabel>
              <Input value={ street } id="edit-listing-address" onChange={e => setStreet(e.target.value)}/>
            </BasicFormControl>
            <BasicFormControl>
              <InputLabel htmlFor='edit-listing-address'> Suburb </InputLabel>
              <Input value={ suburb } id="edit-listing-address" onChange={e => setSuburb(e.target.value)}/>
            </BasicFormControl>
            <BasicFormControl>
              <InputLabel htmlFor='edit-listing-address'> Postcode </InputLabel>
              <Input value={ postcode } id="edit-listing-address" onChange={e => setPostcode(e.target.value)}/>
            </BasicFormControl>
            <BasicFormControl>
              <InputLabel htmlFor='edit-listing-address'> City </InputLabel>
              <Input value={ city } id="edit-listing-address" onChange={e => setCity(e.target.value)}/>
            </BasicFormControl>
            <BasicFormControl>
              <InputLabel htmlFor='edit-listing-address'> Country </InputLabel>
              <Input value={ country } id="edit-listing-address" onChange={e => setCountry(e.target.value)}/>
            </BasicFormControl>
            <BasicFormControl>
              <InputLabel htmlFor='edit-listing-price'> Price per night </InputLabel>
              <Input value={price} type="number" id="edit-listing-price" onChange={e => setPrice(e.target.value)}/>
            </BasicFormControl>
            <BasicFormControl focused>
              <Typography variant="body1"> Listing thumbnail </Typography>
              {
                (thumbnail === '')
                  ? <input type='file' id='edit-listing-thumbnail' style={{ color: 'red' }} onChange={handleThumbnail}/>
                  : <input type='file' id='edit-listing-thumbnail' onChange={handleThumbnail}/>

              }
            </BasicFormControl>

            <BasicFormControl>
              <div>Property Type</div>
              <select onChange = {e => setPropertyType(e.target.value)}
                value={propertyType}
              >
                <option value="apartment">Apartment</option>
                <option value="unit">Unit</option>
                <option value="house">House</option>
              </select>
            </BasicFormControl>

            <BasicFormControl>
              <InputLabel> Number of bathrooms </InputLabel>
              <Input value={bathrooms} type="number" label="Number of bathrooms on the property" id="create-listing-bathrooms" aria-describedby="my-helper-text" onChange={e => setBathrooms(e.target.value)}/>
            </BasicFormControl>
            <BasicFormControl>
              <InputLabel> Amenities </InputLabel>
              <Input
                type="text"
                value={amenities}
                placeholder=""
                label="Property Amenities"
                id="create-listing-amenities"
                aria-describedby="my-helper-text"
                onChange={e => setAmenities(e.target.value)}
              />
            </BasicFormControl>
            <div>
              <Typography variant="h6">Bedroom properties</Typography>
              <StyledDivider/>
              {
                bedroomsProperty.map((bedroom, bedroomKey) => {
                  return (
                    <div key={bedroomKey}>
                      <div> Bedroom {bedroomKey}
                        {
                          (bedroomKey !== 0) && <IconButton title="Remove bedroom" onClick={e => removeBedroom(bedroomKey)}><CancelIcon/></IconButton>
                        }
                      </div>
                      {
                        Array.from(bedroom).map((bed, bedKey) => {
                          return <div key={bedKey}>
                            <div style={{ display: 'inline-block' }}>
                              <div>Type</div>
                              <select onChange={ e => {
                                const bedrooms = [...bedroomsProperty];
                                bedrooms[bedroomKey][bedKey].type = e.target.value;
                                setBedroomsProperty(bedrooms);
                              }}
                              value={bedroomsProperty[bedroomKey][bedKey].type}
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
                      <Button variant="outlined" onClick={e => addBed(bedroomKey)}> Add bed </Button>

                      <StyledDivider/>
                    </div>
                  );
                })
              }
              <Button variant="outlined" onClick={addBedroom}> Add bedroom </Button>
            </div>
            <StyledDivider/>
            <div>
              <Typography variant="h6">Select additional images:</Typography>
              <input type="file" multiple onChange={handleAdditionalPhotos}/>
              <Typography variant="h6">Preview:</Typography>
              {
                (additionalPhotos.length === 0)
                  ? <Typography variant="body1"> No additional images</Typography>
                  : Array.from(additionalPhotos).map((file, key) => {
                    return <Box
                      component="img"
                      sx={{
                        height: 233,
                        width: 350,
                        maxHeight: { xs: 233, md: 167 },
                        maxWidth: { xs: 350, md: 250 },
                      }}
                      alt="other listing"
                      key={key}
                      src={file}
                    />;
                  })
              }
            </div>
            <StyledDivider/>
            <Button type="submit" variant="contained" onClick={ e => handleSubmit(e)}>SUBMIT</Button>
          </form>
        </Paper>
      </Grid>
    </div>
  );
}
