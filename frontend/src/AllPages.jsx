import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import LandingPage from './Components/LandingPage';
import PersonalListings from './Components/PersonalListings';
import EditListing from './Components/EditListing';
import UserSelectedListing from './Components/UserSelectedListing';
import HistoryPage from './Components/HistoryPage';

function AllPages () {
  const initToken = localStorage.getItem('token');
  const [token, setToken] = React.useState(initToken);
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage token={token} setToken={setToken} />} />
        <Route path='/user/login' element={<Login token={token} setToken={setToken} />} />
        <Route path='/user/register' element={<Register token={token} setToken={setToken} />} />
        <Route path='/listings' element={<PersonalListings token={token} setToken={setToken}/>} />
        <Route path='/listings/:listingId' element={<EditListing token={token} setToken={setToken}/>} />
        <Route path='/listing/:listingId' element={<UserSelectedListing token={token} setToken={setToken}/>} />
        <Route path="/history/:listingId" element={<HistoryPage token={token} setToken={setToken}/>} />
      </Routes>
    </>
  );
}

export default AllPages;
