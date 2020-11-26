import React from 'react';
import styled, { keyframes, css } from 'styled-components';

import color from '@/theme/colors';
import video from '@/video';

const moveSlider = keyframes`
  from {
    left: 0;
  }
  to {
    left: 100%;
  }
`;

const StyledDiv = styled.div`
  position: absolute;
  width: 1px;
  border: solid 1px ${color.WHITE};
  height: 7rem;
  animation: ${({ active, duration }) =>
    active &&
    css`
      ${moveSlider} ${duration}s linear infinite;
    `};
`;

const Slider: React.FC = () => {
  return <StyledDiv active duration={video.getDuration()} />;
};

export default Slider;
