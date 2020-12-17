import React from 'react';
import styled, { css, keyframes } from 'styled-components';

import color from '@/theme/colors';
import { Message } from '@/store/originalVideo/reducer';
import video from '@/video';

const UP = 'up';
const DOWN = 'down';

const slideUp = keyframes`
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(0, -2rem);
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
  background-color: ${color.VIDEO};
  padding: 3rem 0;
  border-bottom: 1px solid ${color.BORDER};
`;

const StyledCanvas = styled.canvas`
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.1);
  height: 32rem;
  background-color: ${color.BLACK};
  ${({ isEdit }) => (isEdit === UP ? videoUp : '')};
  ${({ isEdit }) => (isEdit === DOWN ? videoDown : '')};
  ${({ isEdit }) =>
    `transform: ${isEdit === UP ? `translate(0, -2rem)` : `translate(0, 0)`}`}
  ${({ isEncoding }) => (isEncoding ? `scaleY(-1)` : '')};
`;

interface props {
  isEdit: string;
  message: string;
}

const VideoContainer: React.FC<props> = ({ isEdit, message }) => {
  return (
    <StyledDiv>
      <StyledCanvas
        id="glcanvas"
        isEdit={isEdit}
        isEncoding={
          message === Message.ENCODING ||
          message === Message.MUXING ||
          message === Message.UPLOADING
        }
      />
    </StyledDiv>
  );
};

export default VideoContainer;
