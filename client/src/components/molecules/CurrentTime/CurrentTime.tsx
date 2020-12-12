import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import styled from 'styled-components';

import TimeText from '@/components/atoms/TimeText';
import video from '@/video';
import color from '@/theme/colors';
import { getVisible, getIsCrop, getStartEnd } from '@/store/selectors';
import { moveTo, pause } from '@/store/currentVideo/actions';

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid ${color.BORDER};
  height: 30%;
`;

const getVideoCurrentTime = () => video.get('currentTime');

const CurrentTime: React.FC = () => {
  const { start, end } = useSelector(getStartEnd, shallowEqual);
  const isCrop = useSelector(getIsCrop);
  const [time, setTime] = useState(0);
  const visible = useSelector(getVisible);

  const dispatch = useDispatch();

  useEffect(() => {
    const timer =
      visible &&
      setInterval(() => {
        let newTime = getVideoCurrentTime();
        if (newTime >= end) {
          video.pause();
          dispatch(pause());
          if (newTime > end) {
            video.setCurrentTime((newTime = end));
            dispatch(moveTo(end));
          }
        }
        newTime = Math.floor(Number((newTime - (!isCrop && start)).toFixed(1)));
        if (time !== newTime) setTime(newTime);
      }, 50);
    return () => clearInterval(timer);
  }, [isCrop, time, visible, start, end]);
  return (
    <StyledDiv>
      <TimeText time={time} color={visible ? undefined : 'transparent'} />
    </StyledDiv>
  );
};

export default CurrentTime;
