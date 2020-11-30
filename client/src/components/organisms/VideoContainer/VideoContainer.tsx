import React from 'react';
import styled from 'styled-components';

import color from '@/theme/colors';

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCanvas = styled.canvas`
  height: 35rem;
  background-color: ${color.BLACK};
`;

const VideoContainer: React.FC = () => {
  return (
    <StyledDiv>
      <StyledCanvas id="glcanvas" />
    </StyledDiv>
  );
};

export default VideoContainer;
