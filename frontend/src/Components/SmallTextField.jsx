import { TextField } from '@mui/material';
import React from 'react';

export default function SmallTextField (props) {
  return (<TextField size="small" hiddenLabel {...props} />);
}
