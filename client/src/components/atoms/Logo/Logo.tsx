import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  width: 100px;
`;

const StyledImg = styled.img`
  width: 100px;
`;

interface Props {
  onClick?: () => void;
}

const Logo: React.FC<Props> = ({ onClick }) => (
  <StyledDiv onClick={onClick}>
    <StyledImg src="https://user-images.githubusercontent.com/49153756/99666210-03b80600-2aae-11eb-95b9-f61f52694708.png" />
  </StyledDiv>
);

export default Logo;
