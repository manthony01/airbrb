import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Components/Login';

const token = jest.fn();
// https://stackoverflow.com/questions/66284286/react-jest-mock-usenavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login component - LoginForm', () => {
  test('Renders form elements', () => {
    const { queryByLabelText, queryByText } = render(<Login setToken={token} />);

    const emailInput = queryByLabelText('Email');
    expect(emailInput).toBeInTheDocument();
    const passwordInput = queryByLabelText('Password');
    expect(passwordInput).toBeInTheDocument();
    const submitButton = queryByText('Submit');
    expect(submitButton).toBeInTheDocument();
  });

  test('Display fields are filled', () => {
    const { queryByLabelText } = render(<Login setToken={token} />);

    const emailInput = queryByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
    const passwordInput = queryByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: '123' } });

    expect(emailInput.value).toBe('test@email.com');
    expect(passwordInput.value).toBe('123');
  });
});
