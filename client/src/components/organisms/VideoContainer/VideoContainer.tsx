import React from 'react';
import styled, { css, keyframes } from 'styled-components';

import color from '@/theme/colors';

const UP = 'up';
const DOWN = 'down';

const slideUp = keyframes`
  from {
    transform: translate(0, 2rem);
  }
  to {
    transform: translate(0, 0);
  }
`;

const slideDown = keyframes`
  from {
    transform: translate(0, -2rem);
  }
  to {
    transform: translate(0, 0);
  }
`;

const videoUp = css`
  animation: ${slideUp} 0.3s ease-out;
`;

const videoDown = css`
  animation: ${slideDown} 0.5s ease-out;
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCanvas = styled.canvas`
  height: 32rem;
  background-color: ${color.BLACK};
  ${({ isEdit }) => (isEdit === UP ? videoUp : '')};
  ${({ isEdit }) => (isEdit === DOWN ? videoDown : '')};
`;

interface props {
  isEdit: string;
}

const VideoContainer: React.FC<props> = ({ isEdit }) => {
  return (
    <StyledDiv>
      <StyledCanvas id="glcanvas" isEdit={isEdit} />
    </StyledDiv>
  );
};

export default VideoContainer;
