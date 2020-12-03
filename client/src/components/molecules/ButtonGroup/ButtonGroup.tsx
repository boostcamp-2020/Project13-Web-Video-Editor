import React from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/Button';
import { v4 as uuidv4 } from 'uuid';

const StyledDiv = styled.div<string>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ StyledProps }) => StyledProps};
`;

interface button {
  onClick: () => void;
  message: string;
  type: 'default' | 'transparent' | 'selected';
  children: React.ReactChild;
  disabled: boolean;
}

interface Props {
  buttonData: button[];
  StyledProps: string;
}

const ButtonGroup: React.FC<Props> = ({ buttonData, StyledProps }) => (
  <StyledDiv StyledProps={StyledProps}>
    {buttonData.map(data => (
      <Button
        key={data.message || uuidv4()}
        onClick={data.onClick}
        message={data.message}
        type={data.type}
        disabled={data.disabled}
      >
        {data.children}
      </Button>
    ))}
  </StyledDiv>
);

export default ButtonGroup;
