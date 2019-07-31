import React, { Component } from 'react';
import styled from 'styled-components';
import Flex from 'styled-flex-component';
import { withRouter } from 'react-router-dom';

import packageJSON from '../package.json';
import Gateway from './Gateway';

const Container = styled.article``;

const Title = styled.h1`
  text-align: center;
  color: white;
  font-size: 48px;
`;
const Intro = styled.p`
  text-align: center;
  color: #333;
  opacity: 0.5;
  font-size: 24px;
  width: 510px;
`;

const Examples = styled(Flex)`
  margin-left: calc(50vw - 260px);
  width: 510px;
`;
const Example = styled.a`
  text-align: start;
  box-decoration-break: clone;
  font-weight: 700;
  color: #333;

  margin-top: 20px;
`;

class HomePage extends Component<{ match: { params: { hash: string } } }> {
  render() {
    // if we are deployed and in 404.html, though the url is something like https://onetwo.ren/ipfs-browser-gateway/ipfs/QmXD8TDFDn7kfsmCD2eQ3QWuhLpvj7LB5tbzU44iypdmQ9 , but we are still in Home component due to gh-page's single html serving
    if (window.location.href.startsWith(`${packageJSON.homepage}ipfs/`)) {
      return (
        <Container>
          <Title>IPFS Browser Gateway Playground</Title>
          <Gateway />
        </Container>
      );
    }
    return (
      <Container>
        <Title>IPFS Browser Gateway Playground</Title>
        <Examples column>
          <Intro>
            try add <code>/ipfs/somehashblabla</code> to the URL
          </Intro>
          <Example href="ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG">
            directory listing: ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
          </Example>
          <Example href="ipfs/QmXD8TDFDn7kfsmCD2eQ3QWuhLpvj7LB5tbzU44iypdmQ9">
            simple file: ipfs/QmXD8TDFDn7kfsmCD2eQ3QWuhLpvj7LB5tbzU44iypdmQ9
          </Example>
          <Example href="ipfs/QmeYxwj4CwCeGVhwi3xLrmBZUUFQdftshSiGLrTdTnWEVV">
            directory containing a web page: ipfs/QmeYxwj4CwCeGVhwi3xLrmBZUUFQdftshSiGLrTdTnWEVV
          </Example>
        </Examples>
      </Container>
    );
  }
}

export default withRouter(HomePage);
