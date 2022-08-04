import styled from '@emotion/styled';
import React from 'react';

function Footer() {
  const _Footer = styled.footer`
    align-items: center;
    background-color: #282c34;
    color: white;
    display: flex;
    flex-direction: column;
    font-size: calc(10px + 2vmin);
    justify-content: center;
    min-height: 70px;
  `;

  const _FooterDescription = styled.h1`
    font-family: 'Times New Roman', Times, serif;
    font-size: 3rem;
  `;

  return (
    <_Footer>
      <_FooterDescription>pudding cool</_FooterDescription>
    </_Footer>
  );
}

export { Footer };
