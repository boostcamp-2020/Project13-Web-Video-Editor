import React, { MutableRefObject, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useSelector } from 'react-redux';

import { getPlaying, getCurrentTime, getStartEnd } from '@/store/selectors';
import color from '@/theme/colors';
import video from '@/video';

interface Props {
  thumbnailRef: MutableRefObject<HTMLDivElement>;
}

const moveSlider = location => keyframes`
  from {
    left: ${location}px;
  }
  to {
    left: 100%;
  }
`;

const StyledDiv = styled.div`
  position: absolute;
  left: ${({ location }) => `${location}px`};
  width: 1px;
  border: solid 1px ${color.WHITE};
  height: 7rem;
  animation: ${({ active, duration, location }) =>
    active &&
    css`
      ${moveSlider(location)} ${duration}s linear forwards;
    `};
`;

const Slider: React.FC<Props> = ({ thumbnailRef }) => {
  const [location, setLocation] = useState(0);
  const [duration, setDuration] = useState(0);
  const { start, end } = useSelector(getStartEnd);

  const isPlaying = useSelector(getPlaying);
  const time = useSelector(getCurrentTime);

  useEffect(() => {
    const currentTime = video.get('currentTime');

    const width = thumbnailRef.current.clientWidth;
    const totalDuration = end - start;

    const movedLocation = totalDuration
      ? ((currentTime - start) / totalDuration) * width
      : 0;

    const restWidth = width - movedLocation;
    const restDuration = (restWidth / width) * totalDuration;

    setLocation(movedLocation);
    setDuration(restDuration);
  }, [isPlaying, time]);

  return (
    <StyledDiv location={location} duration={duration} active={isPlaying} />
  );
};

export default Slider;
