import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import { postCall } from '../fetch.js';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import NavBar from './NavBar.jsx';
import TransitionAlerts from './TransitionAlert.jsx';

const FormTextField = styled(TextField)({
  marginBottom: 5,
  marginTop: 5,
})

const Form = styled('form')({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  width: '60%',
  padding: 10,
  maxWidth: '500px',
  borderRadius: 10,
})

const Heading = styled('h4')({
  textAlign: 'center',
  marginBottom: '20px',
  color: '#333',
  fontSize: '24px',
});

export default function Login (props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  const setToken = props.setToken;
  const token = localStorage.getItem('token');
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const handleUserLogin = async () => {
    try {
      const result = await postCall('/user/auth/login', {
        email,
        password,
      })
      const token = result.token;
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      navigate('/');
    } catch (e) {
      setErrorMessage(e.message);
      setOpen(true);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <>
      <TransitionAlerts message={errorMessage} open={open} setOpen={setOpen}/>
      <NavBar token={token} setToken={setToken}/>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', shadow: 1, overflow: 'hidden' }}>
        <Form onSubmit={e => handleSubmit(e)}>
          <Heading> Login Form </Heading>
          <FormTextField
            type="text"
            label="Email"
            placeholder="anthony@gmail.com"
            onChange={e => setEmail(e.target.value)}
          /> <br/>
          <FormTextField
            type="password"
            label="Password"
            placeholder="helloworld"
            onChange={e => setPassword(e.target.value)}
          /> <br/>
          <Button type="submit" sx={{ width: '100%' }} variant="contained" onClick={handleUserLogin}>Submit</Button>
        </Form>
      </Box>
    </>
  );
}
