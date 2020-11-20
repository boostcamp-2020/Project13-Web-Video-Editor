import React from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/Button';

const StyledDiv = styled.div<string>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ StyledProps }) => StyledProps};
`;

interface button {
  onClick: () => void;
  message: string;
  type: 'default' | 'transparent';
  children: React.ReactChild;
}

interface Props {
  buttonData: button[];
  StyledProps: string;
}

const ButtonGroup: React.FC<Props> = ({ buttonData, StyledProps }) => (
  <StyledDiv StyledProps={StyledProps}>
    {buttonData.map(data => (
      <Button onClick={data.onClick} message={data.message} type={data.type}>
        {data.children}
      </Button>
    ))}
  </StyledDiv>
);

export default ButtonGroup;
