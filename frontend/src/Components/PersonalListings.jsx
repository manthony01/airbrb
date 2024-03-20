import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
} from '@mui/material';
import NavBar from './NavBar';
import { getCall, deleteCall } from '../fetch';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UnpublishListing from './UnpublishListing';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PublicListingModal from './PublishListingModal';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import CreateListingModal from './CreateListingModal';
import { computeAverageRating, computeBedCount } from '../helpers';
import StarRating from './StarRating';

function PersonalListings (props) {
  const token = props.token;
  const setToken = props.setToken;
  const [listings, setListings] = useState([]);
  const isLoading = !(listings)
  const navigate = useNavigate();

  const Edit = (listing) => {
    navigate(`/listings/${listing.id}`);
  };

  const fetchHostListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const path = '/listings';
      // get all listings
      const data = await getCall(path, token);
      const listingPromises = data.listings.map(async (l) => {
        const result = await getCall(`/listings/${l.id}`, token);
        result.listing.id = l.id;
        return result.listing;
      })
      const allListings = await Promise.all(listingPromises);
      console.log(allListings);
      if (listings && Array.isArray(listings)) {
        const userEmail = localStorage.getItem('email');
        const hostListings = allListings.filter((l) => l.owner === userEmail);
        setListings(hostListings);
      }
    } catch (error) {
      console.error('Error fetching host listings:', error);
    }
  };

  useEffect(() => {
    const getHostListings = async () => {
      try {
        const token = localStorage.getItem('token');
        const path = '/listings';
        // get all listings
        const data = await getCall(path, token);
        const listingPromises = data.listings.map(async (l) => {
          const result = await getCall(`/listings/${l.id}`, token);
          result.listing.id = l.id;
          return result.listing;
        })
        const allListings = await Promise.all(listingPromises);
        const userEmail = localStorage.getItem('email');
        const hostListings = allListings.filter((l) => l.owner === userEmail);
        setListings(hostListings);
      } catch (error) {
        console.error('Error fetching host listings:', error);
      }
    };
    getHostListings();
  }, []);

  const deleteListing = async (listingId) => {
    await deleteCall(`/listings/${listingId}`, token);
    fetchHostListings()
  };

  return (
    <div>
      <NavBar token={token} setToken={setToken}/>
      {
        (isLoading)
          ? <h1> LOADING ... </h1>
          : <>
            <h1>Your Listings</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CreateListingModal fetchHostListings={fetchHostListings} token={token}/>
            </div>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Thumbnail</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Beds</TableCell>
                    <TableCell>Bathrooms</TableCell>
                    <TableCell align="center">Rating</TableCell>
                    <TableCell>Total Reviews</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listings.map((listing, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <img src={listing.thumbnail} alt="Thumbnail" style={{ width: '100px' }} />
                      </TableCell>
                      <TableCell>{listing.title}</TableCell>
                      <TableCell>{listing.metadata.propertyType}</TableCell>
                      <TableCell>
                        {
                          (listing.metadata.bedroomsProperty)
                            ? computeBedCount(listing.metadata.bedroomsProperty)
                            : 'N/A'
                        }
                      </TableCell>
                      <TableCell>{listing.metadata ? listing.metadata.bathrooms : 'N/A'}</TableCell>
                      <TableCell>
                        {
                          (listing.reviews.length !== 0)
                            ? <>
                              <Typography variant="body2" align="center">{computeAverageRating(listing.reviews)}</Typography>
                              <StarRating activeStars={computeAverageRating(listing.reviews)}/>
                            </>
                            : <Typography variant="body2" align="center">N/A</Typography>

                        }
                      </TableCell>
                      <TableCell align="center">{listing.reviews.length}</TableCell>
                      <TableCell>${listing.price ? listing.price : 'N/A' }</TableCell>
                      <TableCell>
                        <span>{listing.published ? 'Now Listed' : 'Not Listed Yet'}</span>
                        <br></br>
                        {
                          (!listing.published)
                            ? <PublicListingModal listingId={listing.id} fetchListings={fetchHostListings}/>
                            : (
                              <Button onClick={() => {
                                UnpublishListing(listing, setListings);
                              }} variant="contained">
                                Unpublish
                              </Button>
                            )
                        }
                      </TableCell>
                      <TableCell>
                        <Button variant='outlined' startIcon={<HistoryIcon />} onClick={() => navigate(`/history/${listing.id}`)}>
                        Booking History
                        </Button>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => Edit(listing)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => deleteListing(listing.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
      }
    </div>

  );
}

export default PersonalListings;
