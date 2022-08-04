import styled from '@emotion/styled';
import React from 'react';

import loading from '../assets/svg/loading.svg';

const LoadingStatus = ({ fetching }) => {
  const _StatusContainer = styled.div`
    height: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const _ModalContainer = styled.div`
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.25);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
  `;

  const _Modal = styled.div`
    width: 250px;
    height: 200px;
    background: white;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  return (
    <_StatusContainer>
      {fetching ? (
        <_ModalContainer>
          <_Modal>
            <img src={loading} alt="loading animation" />
          </_Modal>
        </_ModalContainer>
      ) : (
        <></>
      )}
    </_StatusContainer>
  );
};

export { LoadingStatus };
