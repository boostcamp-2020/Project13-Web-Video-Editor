import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { MdFormatColorReset } from 'react-icons/md';

import Button from '@/components/atoms/Button';
import { resetFilter, Filter } from '@/store/history/actions';
import size from '@/theme/sizes';
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
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(resetFilter());
  };

  return (
    <StyledColorOuterDiv>
      <StyledColorNestedDiv>
        <StyledP>R </StyledP>
        <StyledP>G </StyledP>
        <StyledP>B </StyledP>
      </StyledColorNestedDiv>
      <StyledColorNestedDiv>
        <Range filter={Filter.RED} />
        <Range filter={Filter.GREEN} />
        <Range filter={Filter.BLUE} />
      </StyledColorNestedDiv>
      <StyledColorNestedDiv>
        <StyledP>Blur</StyledP>
        <StyledP>Luminance</StyledP>
        <StyledP>GrayScale</StyledP>
      </StyledColorNestedDiv>
      <StyledColorNestedDiv>
        <Range filter={Filter.BLUR} />
        <Range filter={Filter.LUMINANCE} />
        <Range filter={Filter.GRAYSCALE} />
      </StyledColorNestedDiv>
      <Button
        message="초기화"
        type="transparent"
        onClick={handleClick}
        disabled={false}
      >
        <MdFormatColorReset size={size.ICON_SIZE} />
      </Button>
    </StyledColorOuterDiv>
  );
};

export default EffectSlider;
