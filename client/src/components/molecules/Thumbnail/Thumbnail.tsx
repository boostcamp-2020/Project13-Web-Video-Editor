import React, { useState, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { moveTo } from '@/store/currentVideo/actions';
import Slider from '@/components/atoms/Slider';
import HoverSlider from '@/components/molecules/HoverSlider';
import video from '@/video';
import {
  getThumbnails,
  getIsCropAndDuration,
  getStartEnd,
} from '@/store/selectors';
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
  const { isCrop, duration } = useSelector(getIsCropAndDuration, shallowEqual);
  const { start, end } = useSelector(getStartEnd, shallowEqual);

  const [time, setTime] = useState(0);

  const dispatch = useDispatch();

  const thumbnailRef = useRef<HTMLDivElement>(null);
  const hoverSliderRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    video.setCurrentTime(start + time);

    dispatch(moveTo(start + time));
  };

  const handleMouseMove = (event: MouseEvent) => {
    const slider = hoverSliderRef.current;

    const mouseLocation = event.pageX;
    const offset = thumbnailRef.current.offsetLeft;

    const distance = mouseLocation - offset;

    const width = thumbnailRef.current.clientWidth;
    const interval = isCrop ? duration : end - start;

    const hoverTime = (distance / width) * interval;
    setTime(hoverTime);
    slider.style.left = `${distance}px`;
  };

  const handleMouseLeave = () => {
    hoverSliderRef.current.style.display = 'none';
  };

  const handleMouseEnter = () => {
    hoverSliderRef.current.style.display = 'block';
  };

  const Thumbnails = useMemo(
    () =>
      (isCrop ? video.getThumbnails() : thumbnails).map((image, idx) => (
        <StyledImg key={uuidv4()} src={image} alt="" />
      )),
    [isCrop, thumbnails]
  );

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
      {Thumbnails}
    </StyledDiv>
  );
};

export default Thumbnail;
