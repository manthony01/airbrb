import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import NavBarAccordian from '../Components/NavBarAccordian';

const props = {
  setFilterType: () => {},
  setFilterParameters: () => {},
  filterParameters: () => {},
}
describe('NavBarAccordian tests', () => {
  it('should render five filter options', () => {
    render(<NavBarAccordian setFilterType={props.setFilterType} setFilterParameters={props.setFilterParameters} filterParameters={props.filterParameters}/>)
    expect(screen.getAllByRole('filter-option')).toHaveLength(5);
  });
  it('should unexpand an option if already open', () => {
    render(<NavBarAccordian setFilterType={props.setFilterType} setFilterParameters={props.setFilterParameters} filterParameters={props.filterParameters}/>)
    expect(screen.getAllByRole('filter-option')).toHaveLength(5);
    // by default have one expanded and 4 non expanded tabs
    expect(screen.getAllByRole('button', { expanded: false })).toHaveLength(4);
    expect(screen.getAllByRole('button', { expanded: true })).toHaveLength(1);
    userEvent.click(screen.getByRole('button', { expanded: true }));
    // After selecting the expanded option, show it has closed
    expect(screen.getAllByRole('button', { expanded: false })).toHaveLength(5);
  });

  it('should expand an option if already closed and close the previously expanded one', () => {
    render(<NavBarAccordian setFilterType={props.setFilterType} setFilterParameters={props.setFilterParameters} filterParameters={props.filterParameters}/>)
    expect(screen.getAllByRole('filter-option')).toHaveLength(5);
    // by default, 1 tab is expanded with the rest being collapsed
    expect(screen.getAllByRole('button', { expanded: false })).toHaveLength(4);
    expect(screen.getAllByRole('button', { expanded: true })).toHaveLength(1);
    // get unselected filter option
    expect(screen.getByRole('button', { name: /Price/i, expanded: false })).toBeInTheDocument();
    // click it
    userEvent.click(screen.getByRole('button', { name: /Price/i, controls: 'price-content', expanded: false }));
    // show that it is now selected, and the previously selected one has been deselected in the process
    expect(screen.getByRole('button', { name: /Price/i, controls: 'price-content', expanded: true })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { expanded: false })).toHaveLength(4);
  });

  it('should render an apply and clear filter button', () => {
    render(<NavBarAccordian setFilterType={props.setFilterType} setFilterParameters={props.setFilterParameters} filterParameters={props.filterParameters}/>)
    expect(screen.getByRole('button', { name: /apply filter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear filter/i })).toBeInTheDocument();
  });
});
