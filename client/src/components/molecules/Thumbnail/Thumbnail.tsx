import React, { useState, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { moveTo } from '@/store/currentVideo/actions';
import Slider from '@/components/atoms/Slider';
import HoverSlider from '@/components/molecules/HoverSlider';
import video from '@/video';
import {
  getMessage,
  getThumbnails,
  getIsCropAndDuration,
  getStartEnd,
  getStatus,
  getFilterStatus,
} from '@/store/selectors';
import { Status, FilterStatus } from '@/store/history/actions';
import CropLayer from '@/components/molecules/CropLayer';
import color from '@/theme/colors';

const StyledDiv = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 50px;
  transform: scale(${props => props.status.scale})
    scaleY(${props => (props.status.flipped ? -1 : 1)})
    rotate(${props => props.status.rotation}deg);
  filter: grayScale(${props => props.filterStatus.grayScale}%)
    brightness(${props => props.filterStatus.brightness})
    blur(${props => props.filterStatus.blur}px);
`;
const ImageDiv = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.3333%;
  height: 50px;
  background-color: ${color.BLACK};
  min-width: 3.3333%;
  min-height: 50px;
`;

const renderThumbnails = (
  thumbnails: string[],
  status: Status,
  filterStatus: FilterStatus
) =>
  thumbnails.map(image => (
    <ImageDiv key={uuidv4()}>
      <StyledImg
        key={uuidv4()}
        src={image}
        status={status}
        filterStatus={filterStatus}
        alt=""
      />
    </ImageDiv>
  ));

const Thumbnail: React.FC = () => {
  const message = useSelector(getMessage);
  const thumbnails = useSelector(getThumbnails);
  const { isCrop, duration } = useSelector(getIsCropAndDuration, shallowEqual);
  const { start, end } = useSelector(getStartEnd, shallowEqual);
  const status = useSelector(getStatus);
  const filterStatus = useSelector(getFilterStatus);

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

  const OriginalThumbnails = useMemo(
    () => renderThumbnails(video.getThumbnails(), status, filterStatus),
    [message] // URL is not enough to check whether thumbnail is ready
  );
  const Thumbnails = useMemo(
    () => renderThumbnails(thumbnails, status, filterStatus),
    [thumbnails, status, filterStatus]
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
      {isCrop ? OriginalThumbnails : Thumbnails}
    </StyledDiv>
  );
};

export default Thumbnail;
