import styled from '@emotion/styled';
import React from 'react';

const Episode = ({ link, title }) => {
  const _ListGroup = styled.div`
    font-size: 1rem;
    font-weight: 700;
    padding: 10px;
  `;
  const _ListGroupItem = styled.p`
    text-align: center;
  `;

  return (
    <_ListGroup>
      <_ListGroupItem>{title}</_ListGroupItem>
      <audio src={link} controls={true} autoPlay={false}></audio>
    </_ListGroup>
  );
};

export default Episode;
