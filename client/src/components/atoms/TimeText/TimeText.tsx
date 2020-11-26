import React from 'react';
import styled from 'styled-components';
import parseTime from '@/utils/time';

const StyledP = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ color }) => color || ''};
`;

interface Props {
  time: number;
  color?: string;
}

const TimeText: React.FC<Props> = ({ time, color }) => {
  return <StyledP color={color}>{parseTime(time)}</StyledP>;
};

export default TimeText;
