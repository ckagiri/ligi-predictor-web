import React from 'react';
import {
  Alert,
  Button
} from 'react-bootstrap';

const propTypes = {};

export default function NotFound() {
  return (
    <div className='not-found'>
      <Alert bsStyle='info'>
        <p>
          { 'Sorry, we couldn\'t find a page for that address.' }
        </p>
      </Alert>
      <a href={'/map'}>
        <Button
          bsSize='lg'
          bsStyle='primary'
          >
          Take me to the Challenges
        </Button>
      </a>
    </div>
  );
}

NotFound.displayName = 'NotFound';
NotFound.propTypes = propTypes;
