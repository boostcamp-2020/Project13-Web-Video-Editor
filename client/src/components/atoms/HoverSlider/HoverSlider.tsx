import React, { MutableRefObject } from 'react';
import styled from 'styled-components';

import TimeText from '@/components/atoms/TimeText';
import color from '@/theme/colors';

interface Props {
  hoverSliderRef: MutableRefObject<HTMLDivElement>;
  hoverTime: number;
}

const StyledDiv = styled.div`
  position: absolute;
  display: none;
  left: 0;
  width: 1px;
  border: solid 1px ${color.GRAY};
  height: 7rem;
`;

const WrapperDiv = styled.div`
  position: absolute;
  top: -16px;
  left: -15px;
`;

const HoverSlider: React.FC<Props> = ({ hoverSliderRef, hoverTime }) => {
  return (
    <StyledDiv ref={hoverSliderRef}>
      <WrapperDiv>
        <TimeText time={hoverTime} />
      </WrapperDiv>
    </StyledDiv>
  );
};

export default HoverSlider;
