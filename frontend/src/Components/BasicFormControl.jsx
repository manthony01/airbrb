import React from 'react';
import { FormControl } from '@mui/material';

export default function BasicFormControl (props) {
  return (
    <FormControl sx={{ display: 'block' }} variant='standard' margin='normal' size='small' {...props}>
      { props.children }
    </FormControl>
  )
}
