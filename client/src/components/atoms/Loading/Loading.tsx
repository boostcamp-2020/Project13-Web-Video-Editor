import React from 'react';
import styled, { keyframes } from 'styled-components';

import color from '@/theme/colors';

const drift = keyframes`
  from {
    transform: rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(360deg);
    opacity: 0;
    top: -200px;
    left: 0;
    width: 1500px;
    height: 1500px;
  }
`;

const Wave = styled.div`
  position: absolute;
  top: 20%;
  left: 48%;
  border: 5px solid #3781aa;
  width: 150px;
  height: 150px;
  border-radius: 45%;
  transform-origin: 50% 48%;
  animation: ${drift} 3s infinite linear;
`;

const Wave1 = styled(Wave)`
  border: 5px solid 4s ${color.BLUE};
`;

const Wave2 = styled(Wave)`
  border: 6px solid ${color.LIGHT_PURPLE};
  animation: ${drift} 5s infinite linear;
`;

const Wave3 = styled(Wave)`
  border: 7px solid ${color.PALE_PURPLE};
  animation: ${drift} 7s infinite linear;
`;

const Wave4 = styled(Wave)`
  border: 3px solid ${color.LIGHT_GREEN};
  animation: ${drift} 6s infinite linear;
`;

const StyledDiv = styled.div`
  display: block;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: ${color.DARK_GRAY};
  z-index: 11;
  opacity: 0.5;
`;

const grow = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) skew(10deg);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const StyledP = styled.p`
  margin: 0;
  font-size: 1.5rem;
  position: absolute;
  top: 30%;
  left: 45%;
  animation: ${grow} 4s infinite linear;
`;

interface Props {
  message: string;
}

const Loading: React.FC<Props> = ({ message }) => {
  return (
    <StyledDiv>
      <StyledP>{message}</StyledP>
      <Wave1 />
      <Wave2 />
      <Wave3 />
      <Wave4 />
    </StyledDiv>
  );
};

export default Loading;
