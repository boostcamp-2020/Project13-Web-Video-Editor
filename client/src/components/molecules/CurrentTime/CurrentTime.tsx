import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import styled from 'styled-components';

import TimeText from '@/components/atoms/TimeText';
import video from '@/video';
import color from '@/theme/colors';
import {
  getVisible,
  getIsCropAndDuration,
  getStartEnd,
} from '@/store/selectors';
import { moveTo, pause } from '@/store/currentVideo/actions';

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid ${color.BORDER};
  height: 30%;
`;

const CurrentTime: React.FC = () => {
  const currentTime = () => video.get('currentTime');
  const { start, end } = useSelector(getStartEnd, shallowEqual);
  const cropState = useSelector(getIsCropAndDuration, shallowEqual);
  const [time, setTime] = useState(Math.floor(currentTime() - start));
  const visible = useSelector(getVisible);

  const dispatch = useDispatch();

  useEffect(() => {
    const timer =
      visible &&
      setInterval(() => {
        let newTime = currentTime();
        if (newTime >= end) {
          if (!cropState.isCrop) video.pause();
          dispatch(pause());
          newTime = end;
          dispatch(moveTo(end));
        }
        newTime = Math.floor(newTime - start);
        if (time !== newTime) setTime(newTime);
      }, 50);
    return () => clearInterval(timer);
  }, [visible]);

  return (
    <StyledDiv>
      <TimeText time={time} color={visible ? undefined : 'transparent'} />
    </StyledDiv>
  );
};

export default CurrentTime;
