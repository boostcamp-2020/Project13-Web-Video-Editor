import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import Thumbnail from '@/components/molecules/Thumbnail';
import TimeZone from '@/components/molecules/TimeZone';
import CurrentTime from '@/components/molecules/CurrentTime';
import { getName } from '@/store/selectors';
import color from '@/theme/colors';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10rem;
`;

const TimeLineDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const TimeLineRight = styled(TimeLineDiv)`
  width: 85%;
  border: 1px solid ${color.BORDER};
  border-left: none;
  justify-content: space-evenly;
`;

const TimeLineLeft = styled(TimeLineDiv)`
  display: flex;
  justify-content: space-evenly;
  width: 15%;
  border: 1px solid ${color.BORDER};
`;

const StyledDiv = styled.div`
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WrapperDiv = styled(StyledDiv)`
  padding: 0 1rem;
`;

const Name = styled.p`
  margin: 0;
  font-size: 12px;
`;

const TimeLine: React.FC = () => {
  const name = useSelector(getName);

  return (
    <Container>
      <TimeLineLeft>
        <CurrentTime />
        <StyledDiv>
          <Name>{name}</Name>
        </StyledDiv>
      </TimeLineLeft>

      <TimeLineRight>
        <TimeZone />
        <WrapperDiv>
          <Thumbnail />
        </WrapperDiv>
      </TimeLineRight>
    </Container>
  );
};

export default TimeLine;
