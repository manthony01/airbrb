import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AllPages from './AllPages';

function App () {
  return (
    <>
      <Router>
        <AllPages/>
      </Router>
    </>
  );
}

export default App;
