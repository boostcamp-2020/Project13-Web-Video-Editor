import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { moveTo } from '@/store/currentVideo/actions';
import Slider from '@/components/atoms/Slider';
import HoverSlider from '@/components/atoms/HoverSlider';
import video from '@/video';
import { getThumbnails, getIsCrop } from '@/store/selectors';
import CropLayer from '@/components/molecules/CropLayer';

const StyledDiv = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const StyledImg = styled.img`
  width: 3.3333%;
  height: 50px;
`;

const Thumbnail: React.FC = () => {
  const thumbnails = useSelector(getThumbnails);
  const isCrop = useSelector(getIsCrop);

  const [time, setTime] = useState(0);

  const dispatch = useDispatch();

  const thumbnailRef = useRef<HTMLDivElement>(null);
  const hoverSliderRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    video.setCurrentTime(time);

    dispatch(moveTo(time));
  };

  const handleMouseMove = (event: MouseEvent) => {
    const slider = hoverSliderRef.current;

    const mouseLocation = event.pageX;
    const offset = thumbnailRef.current.offsetLeft;

    const distance = mouseLocation - offset;

    const width = thumbnailRef.current.clientWidth;
    const duration = video.get('duration');

    const hoverTime = (distance / width) * duration;

    setTime(hoverTime);
    slider.style.left = `${distance}px`;
  };

  const handleMouseLeave = () => {
    hoverSliderRef.current.style.display = 'none';
  };

  const handleMouseEnter = () => {
    hoverSliderRef.current.style.display = 'block';
  };

  return (
    <StyledDiv
      ref={thumbnailRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {isCrop && <CropLayer />}
      <HoverSlider hoverSliderRef={hoverSliderRef} hoverTime={time} />
      <Slider thumbnailRef={thumbnailRef} />
      {thumbnails.map(image => {
        return <StyledImg key={image} src={image} alt="" />;
      })}
    </StyledDiv>
  );
};

export default Thumbnail;
