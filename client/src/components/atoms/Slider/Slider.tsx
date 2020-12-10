import React, { MutableRefObject, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useSelector, shallowEqual } from 'react-redux';

import {
  getPlaying,
  getCurrentTime,
  getIsCropAndDuration,
  getStartEnd,
} from '@/store/selectors';
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
  z-index: 5;
`;

const Slider: React.FC<Props> = React.memo(({ thumbnailRef }) => {
  const [location, setLocation] = useState(0);
  const [restDuration, setRestDuration] = useState(0);
  const { start, end } = useSelector(getStartEnd, shallowEqual);

  const { isCrop, duration } = useSelector(getIsCropAndDuration);
  const isPlaying = useSelector(getPlaying);
  const time = useSelector(getCurrentTime);

  useEffect(() => {
    const currentTime = video.get('currentTime');

    const width = thumbnailRef.current.clientWidth;
    const totalDuration = isCrop ? duration : end - start;

    const movedLocation = totalDuration
      ? ((currentTime - (!isCrop && start)) / totalDuration) * width
      : 0;
    setLocation(movedLocation);

    const restWidth = width - movedLocation;
    setRestDuration((restWidth / width) * totalDuration);
  }, [isCrop, isPlaying, time]);

  return (
    <StyledDiv location={location} duration={restDuration} active={isPlaying} />
  );
});

export default Slider;
