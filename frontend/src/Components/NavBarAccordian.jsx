import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Button, Input } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function NavBarAccordian (props) {
  const setFilterType = props.setFilterType;
  const setFilterParameters = props.setFilterParameters;
  const filterParameters = props.filterParameters;
  const [expanded, setExpanded] = React.useState('bedrooms');
  const [bedroomMin, setBedroomMin] = React.useState('');
  const [bedroomMax, setBedroomMax] = React.useState('');
  const [dateMin, setDateMin] = React.useState('');
  const [dateMax, setDateMax] = React.useState('');
  const [priceMax, setPriceMax] = React.useState('');
  const [priceMin, setPriceMin] = React.useState('');
  const [ratingOrder, setRatingOrder] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleClearFilter = () => {
    setFilterType(null);
    props.setOpen(false);
  }

  const handleSubmit = () => {
    // update the filter parameters
    const selectedFilter = expanded;
    const filterParametersCopy = { ...filterParameters };
    // set filter type
    setFilterType(selectedFilter);
    if (selectedFilter === 'search') {
      filterParametersCopy.search = searchQuery;
    } else if (selectedFilter === 'bedrooms') {
      const bedroomParameters = filterParametersCopy.bedrooms;
      bedroomParameters.min = bedroomMin;
      bedroomParameters.max = bedroomMax;
    } else if (selectedFilter === 'price') {
      const priceParameters = filterParametersCopy.price;
      priceParameters.min = priceMin;
      priceParameters.max = priceMax;
    } else if (selectedFilter === 'dates') {
      const dateParameters = filterParametersCopy.dates;
      dateParameters.min = dateMin;
      dateParameters.max = dateMax;
    } else if (selectedFilter === 'ratings') {
      filterParametersCopy.ratings = ratingOrder;
    } else {
      alert('Please select a filter');
      return;
    }
    setFilterParameters(filterParametersCopy);
    // close the popper
    props.setOpen(false);
  }

  return (
    <>
      <Button
        name="apply-filter"
        variant="contained"
        onClick={handleSubmit}
      > Apply filter </Button>
      <Button
        name="clear-filter"
        variant="contained"
        onClick={handleClearFilter}
      > Clear filter </Button>
      <Accordion name="bedrooms" role="filter-option" expanded={expanded === 'bedrooms'} onChange={handleChange('bedrooms')}>
        <AccordionSummary aria-controls="bedrooms-content" id="bedrooms-header">
          <Typography>Number of bedrooms</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl style={{ display: 'inline-block', width: '40%' }}>
            Minimum bedrooms
            <Input onChange={ e => setBedroomMin(e.target.value) } type="number"/>
          </FormControl>
          <FormControl style={{ display: 'inline-block', width: '40%' }}>
            Maximum bedrooms
            <Input onChange={ e => setBedroomMax(e.target.value) } type="number"/>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion name="dates" role="filter-option" expanded={expanded === 'dates'} onChange={handleChange('dates')}>
        <AccordionSummary aria-controls="dates-content" id="dates-header">
          <Typography>Date range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl style={{ display: 'inline-block', width: '40%' }}>
            Start date
            <Input onChange={e => setDateMin(e.target.value)} type="date"/>
          </FormControl>
          <FormControl style={{ display: 'inline-block', width: '40%' }}>
            End date
            <Input onChange={e => setDateMax(e.target.value)} type="date"/>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion name="price" role="filter-option" expanded={expanded === 'price'} onChange={handleChange('price')}>
        <AccordionSummary aria-controls="price-content" id="price-header">
          <Typography>Price</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl style={{ display: 'inline-block', width: '40%' }}>
            Min price
            <Input type="number" onChange={e => setPriceMin(e.target.value)}/>
          </FormControl>
          <FormControl style={{ display: 'inline-block', width: '40%' }}>
            Max price
            <Input required type="number" onChange={e => setPriceMax(e.target.value)}/>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion name="ratings" role="filter-option" expanded={expanded === 'ratings'} onChange={handleChange('ratings')}>
        <AccordionSummary aria-controls="ratings-content" id="ratings-header">
          <Typography>Review ratings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
            <RadioGroup
              row
              defaultValue="decreasing"
              aria-labelledby="demo-row-radio-buttons-group-label"
              onChange={e => setRatingOrder(e.target.value)}
              name="row-radio-buttons-group"
            >
              <FormControlLabel value="decreasing" control={<Radio />} label="Highest to Lowest" />
              <FormControlLabel value="increasing" control={<Radio />} label="Lowest to Highest" />
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion name="search" role="filter-option" expanded={expanded === 'search'} onChange={handleChange('search')}>
        <AccordionSummary aria-controls="search-content" id="search-header">
          <Typography>Title and/or city location</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl style={{ display: 'inline-block', width: '40%' }}>
            Query
            <Input required type="text" onChange={e => setSearchQuery(e.target.value)}/>
          </FormControl>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
