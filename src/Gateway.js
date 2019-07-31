// @flow
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import Flex from 'styled-flex-component';

import packageJSON from '../package.json';

const Container = styled(Flex)`
  overflow: scroll;
`;

export function GatewayComponent(props: { match: { params: { hash: string } } }) {
  const [hasSWSupport, setSWSupportState] = useState({ support: null, message: '' });
  const {
    match: {
      params: { hash = window.location.href.split(`${packageJSON.homepage}ipfs/`)[1] },
    },
  } = props;

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setSWSupportState({
          support: true,
          message: 'Your browser supprots service worker, and a service worker is active.',
        });
      });
    } else {
      setSWSupportState({ support: false, message: 'Service workers are not supported in your browser.' });
    }
  }, []);

  useEffect(() => {
    if (hasSWSupport.support === true) {
      window.location.reload();
    }
  }, [hasSWSupport.support]);
  return (
    <Container center column>
      {hasSWSupport.support === null && <p>Checking IPFS Gateway support</p>}
      {hasSWSupport.support === true && (
        <>
          <p key="0">{hasSWSupport.message}</p>
          <p key="1">Usually it will take effect after refreshing. Refreshing for you now:</p>
          <p key="2">{`/ipfs/${hash}`}</p>
        </>
      )}
      {hasSWSupport.support === false && hasSWSupport.message}
    </Container>
  );
}

export default withRouter(GatewayComponent);
