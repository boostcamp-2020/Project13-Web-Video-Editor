import React from 'react';
import styled from 'styled-components';

import Range from './Range';

const StyledColorOuterDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const StyledColorNestedDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 5%;
`;

const StyledP = styled.p`
  margin: 0;
`;

const EffectSlider: React.FC = () => {
  return (
    <StyledColorOuterDiv>
      <StyledColorNestedDiv>
        <StyledP>R </StyledP>
        <StyledP>G </StyledP>
        <StyledP>B </StyledP>
      </StyledColorNestedDiv>
      <StyledColorNestedDiv>
        <Range id="red" />
        <Range id="green" />
        <Range id="blue" />
      </StyledColorNestedDiv>
      <StyledColorNestedDiv>
        <StyledP>Blur</StyledP>
        <StyledP>Luminance</StyledP>
        <StyledP>GrayScale</StyledP>
      </StyledColorNestedDiv>
      <StyledColorNestedDiv>
        <Range id="blur" />
        <Range id="luminance" />
        <Range id="grayScale" />
      </StyledColorNestedDiv>
    </StyledColorOuterDiv>
  );
};

export default EffectSlider;
