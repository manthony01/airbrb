import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import TransitionAlert from '../Components/TransitionAlert';

describe('TransitionAlerts tests', () => {
  it('should render an alert containing the error message and a button to close it', () => {
    const open = true;
    const setOpen = () => {};
    const message = 'error';
    render(<TransitionAlert message={message} open={open} setOpen={setOpen}/>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { label: /close/i })).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('upon clicking the close button it should close', () => {
    const open = true;
    const mockCloseFunction = jest.fn()
    const message = 'error';
    render(<TransitionAlert message={message} open={open} setOpen={mockCloseFunction}/>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { label: /close/i }));
    expect(mockCloseFunction).toHaveBeenCalledTimes(1);
    expect(mockCloseFunction).toHaveBeenCalledWith(!open);
  });
});
