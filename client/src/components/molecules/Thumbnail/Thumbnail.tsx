import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { moveTo, crop } from '@/store/currentVideo/actions';
import { cropEnd } from '@/store/actionTypes';
import Slider from '@/components/atoms/Slider';
import HoverSlider from '@/components/atoms/HoverSlider';
import video from '@/video';
import {
  getThumbnails,
  getIsCrop,
  getIsCropConfirm,
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
  const isCrop = useSelector(getIsCrop);
  const isCropConfirm = useSelector(getIsCropConfirm);
  // const { thumbnails,isCrop, isCropConfirm } = useSelector(getThumbnailsEffect, shallowEqual);

  const [time, setTime] = useState(0);
  const [position, setPosition] = useState([0, 0]);
  const { start, end } = useSelector(getStartEnd);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isCrop) {
      setPosition([start, end]);
    }
  }, [isCrop]);

  useEffect(() => {
    dispatch(crop(position[0], position[1]));
    dispatch(cropEnd());
  }, [isCropConfirm]);

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
    const duration = video.getDuration();

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
      {isCrop && <CropLayer positions={position} setPositions={setPosition} />}
      <HoverSlider hoverSliderRef={hoverSliderRef} hoverTime={time} />
      <Slider thumbnailRef={thumbnailRef} />
      {thumbnails.map(image => {
        return <StyledImg key={image} src={image} alt="" />;
      })}
    </StyledDiv>
  );
};

export default Thumbnail;
