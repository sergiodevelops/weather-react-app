import React from 'react';
import { render, screen } from '@testing-library/react';
import CityWeather from 'CityWeather';

test('renders learn react link', () => {
  render(<CityWeather />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
