import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCanvas = styled.canvas`
  width: 50%;
  height: 20rem;
`;

const VideoContainer: React.FC = () => {
  return (
    <StyledDiv>
      <StyledCanvas id="glcanvas" />
    </StyledDiv>
  );
};

export default VideoContainer;