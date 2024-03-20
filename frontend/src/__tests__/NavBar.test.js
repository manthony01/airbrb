import { render, screen } from '@testing-library/react';
import * as React from 'react';
import NavBar from '../Components/NavBar';
import { BrowserRouter } from 'react-router-dom';

const token = '123';

describe('navbar tests', () => {
  it('should only render the logo and three buttons on the right when user is not logged in', () => {
    const { container } = render(
      <BrowserRouter>
        <NavBar token={null}/>
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
    // only render logo and buttons on the right
    expect(container.getElementsByClassName('navbar-section')).toHaveLength(2);

    // render all listings, login and register buttons
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getByRole('button', { name: /all listings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should instead render two buttons', () => {
    render(
      <BrowserRouter>
        <NavBar token={token}/>
      </BrowserRouter>
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /all listings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /my account/i })).toBeInTheDocument();
  });

  it('should render an additional filter option when the onLandingPage prop is parsed', () => {
    const { container } = render(
      <BrowserRouter>
        <NavBar token={token} onLandingPage/>
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
    expect(container.getElementsByClassName('navbar-section')).toHaveLength(3);
  });
});
