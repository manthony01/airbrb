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

function Register (props) {
  const token = localStorage.getItem('token');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  const setToken = props.setToken;
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handlerUserRegister = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      } else {
        const result = await postCall('/user/auth/register', {
          email,
          password,
          name
        })
        const token = result.token;
        localStorage.setItem('email', email);
        localStorage.setItem('token', token);
        setToken(token);
        navigate('/');
      }
    } catch (e) {
      setErrorMessage(e.message);
      setOpen(true);
    }
  }
  return (<>
    <TransitionAlerts message={errorMessage} open={open} setOpen={setOpen}/>
    <NavBar token={token} setToken={setToken}/>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', shadow: 1, overflow: 'hidden' }}>
      <Form sx={{ boxShadow: 10 }} onSubmit={ e => e.preventDefault() }>
        <Heading>Register Form</Heading>
        <FormTextField
          type="text"
          label="Name"
          name="name"
          placeholder="Anthony Kim"
          onChange={e => setName(e.target.value)}
        /> <br/>
        <FormTextField
          type="text"
          label="Email"
          name="email"
          placeholder="anthony@gmail.com"
          onChange={e => setEmail(e.target.value)}
        /> <br/>
        <FormTextField
          type="password"
          label="Password"
          name="password"
          placeholder="helloworld"
          onChange={e => setPassword(e.target.value)}
        /> <br/>
        <FormTextField
          type="password"
          label="Confirm Password"
          name="cpassword"
          placeholder="helloworld"
          onChange={ e => setConfirmPassword(e.target.value)}
        /> <br/>
        <Button variant="contained" onClick={handlerUserRegister}>Submit</Button>
      </Form>

    </Box>
  </>
  );
}

export default Register;
