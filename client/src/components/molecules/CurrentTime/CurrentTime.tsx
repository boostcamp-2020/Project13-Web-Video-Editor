import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import TimeText from '@/components/atoms/TimeText';
import video from '@/video';
import color from '@/theme/colors';
import { getVisible } from '@/store/selectors';

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid ${color.BORDER};
  height: 30%;
`;

const CurrentTime: React.FC = () => {
  const currentTime = () => Math.round(video.getCurrentTime());

  const [time, setTime] = useState(currentTime());
  const visible = useSelector(getVisible);

  useEffect(() => {
    const timer =
      visible &&
      setInterval(() => {
        const newTime = currentTime();
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
