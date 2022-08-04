import styled from '@emotion/styled';
import React from 'react';

function Header() {
  const _Header = styled.header`
    position: sticky;
    top: 0;
    z-index: 11;
    align-items: center;
    background-color: #282c34;
    color: white;
    display: flex;
    flex-direction: column;
    font-size: calc(10px + 2vmin);
    justify-content: center;
    min-height: 70px;
  `;

  const _HeaderDescrition = styled.h1`
    font-family: 'Times New Roman', Times, serif;
    font-size: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  return (
    <_Header>
      <_HeaderDescrition>Cool Podcast Feed</_HeaderDescrition>
    </_Header>
  );
}

export { Header };
