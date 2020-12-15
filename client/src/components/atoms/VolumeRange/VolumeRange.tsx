import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import color from '@/theme/colors';
import { setAudio } from '@/store/currentVideo/actions';
import video from '@/video';

interface Props {
  volume: number;
  setVolumeVisible;
}

const StyledOuterDiv = styled.div`
  position: absolute;
  left: 250px;
  top: -120%;
  width: 40px;
  height: 130px;
  background-color: ${color.DARK_GRAY}; // darkgray
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
`;

const StyledInnerDiv = styled.div`
  width: 25px;
  height: 110px;
  background-color: ${color.BLACK};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledInput = styled.input`
  width: 112px !important;
  height: 26px !important;
  border-radius: 5px !important;
  transform: rotate(-90deg) !important;
  background: linear-gradient(
    -0.25turn,
    ${color.BLACK} 0%,
    ${color.BLACK} ${({ value }) => 100 - value}%,
    ${color.PURPLE} ${({ value }) => 100 - value + 1}%,
    ${color.PALE_PURPLE}
  ) !important;

  ::-webkit-slider-thumb {
    border-radius: 5px !important;
    height: 31px !important;
  }
`;

const VolumeRange: React.FC<Props> = ({ volume, setVolumeVisible }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(volume * 100);

  const handleChange = useCallback(e => {
    const currentValue = e.target.value; // todo
    setValue(currentValue);
    dispatch(setAudio(Number(currentValue / 100)));
  }, []);

  useEffect(() => {
    setValue(volume * 100);
    video.setVolume(volume);
  }, [volume]);

  const handleMouseLeave = () => {
    setVolumeVisible(false);
  };

  return (
    <StyledOuterDiv>
      <StyledInnerDiv>
        <StyledInput
          type="range"
          value={value}
          onChange={handleChange}
          onMouseLeave={handleMouseLeave}
        />
      </StyledInnerDiv>
    </StyledOuterDiv>
  );
};

export default VolumeRange;
