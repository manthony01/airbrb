import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import StarRating from '../Components/StarRating';

describe('StarRating Component', () => {
  test('renders with correct active stars', () => {
    const { queryByLabelText } = render(<StarRating activeStars={4.5} />);
    const ratingElement = queryByLabelText('4.5 Stars');

    expect(ratingElement).toBeInTheDocument();
  });

  test('renders with different active stars', () => {
    const { queryByLabelText } = render(<StarRating activeStars={2.4} />);
    const ratingElement = queryByLabelText('2.4 Stars');

    expect(ratingElement).toBeInTheDocument();
  });
});
