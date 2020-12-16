import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import color from '@/theme/colors';
import video from '@/video';
import { shallowEqual, useSelector } from 'react-redux';
import { getStartEnd } from '@/store/selectors';

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  z-index: 9;
  opacity: 1;
  flex-direction: column;
`;

const Overlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: ${color.BLACK};
  z-index: 10;
  opacity: 0.5;
  flex-direction: column;
  font-family: Sans-Serif;
  font-weight: bold;
`;

const ProgressBorder = styled.div`
  position: absolute;
  width: 30rem;
  height: 5rem;
  top: 30%;
  left: calc(50% - 15rem);
  background-color: transparent;
  border: 5px solid ${color.PALE_PURPLE};
  opacity: 1;
  box-shadow: 0 0 20px ${color.PALE_PURPLE};
  border-radius: 10px;
  z-index: 14;
`;

const ProgressBar = styled.div`
  position: absolute;
  height: calc(5rem - 10px);
  width: ${({ percent }) => `${percent}%`};
  background-color: ${color.PALE_PURPLE};
  border: none;
  z-index: 14;

  -webkit-mask-image: -webkit-gradient(
    linear,
    left center,
    right center,
    from(rgba(0, 0, 0, 0.3)),
    to(rgba(0, 0, 0, 0.8))
  );
`;

const StyledP = styled.p`
  margin: 0;
  position: absolute;
  width: 100%;
  color: ${color.WHITE};
  left: 1rem;
  z-index: 15;
  font-size: 2rem;
  top: calc(50% - 1rem);
  opacity: 0.8;
  text-shadow: 0px 0px 20px ${color.WHITE};
  text-align: center;
`;

const Message = styled(StyledP)`
  width: 50rem;
  top: 25%;
  left: calc(50% - 25rem);
`;

interface Props {
  message: string;
}

const Encoding: React.FC<Props> = ({ message }) => {
  const { start, end } = useSelector(getStartEnd, shallowEqual);
  const divisor = (end - start) / 100;
  const [completedPercent, setCompletedPercent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const progressPercent = Math.round(
        (video.get('currentTime') - start) / divisor
      );

      if (progressPercent !== completedPercent)
        setCompletedPercent(progressPercent);
    }, 50);
    return () => clearInterval(timer);
  }, [completedPercent]);

  return (
    <StyledDiv>
      <Overlay />
      <Message>{message}</Message>
      <ProgressBorder>
        <ProgressBar percent={completedPercent} />
        <StyledP>{`${completedPercent} %`}</StyledP>
      </ProgressBorder>
    </StyledDiv>
  );
};

export default Encoding;
