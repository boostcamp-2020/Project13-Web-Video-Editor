import React from 'react';
import styled from 'styled-components';
import color from '@/theme/colors';

import Props from './props';

const StyledModalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const StyledInput = styled.input`
  width: 75%;
  padding: 0.5rem;
  border-radius: 5px;
  border: none;
  box-shadow: 0 0 1px 2px rgba(255, 255, 255, 0.1);
  background-color: ${color.MODAL};
  color: ${color.WHITE};
  outline: none;
`;

const StyledP = styled.p`
  margin: 0;
  width: 25%;
  font-size: 12px;
  text-align: center;
`;

const TextInput: React.FC<Props<string>> = ({
  state: value,
  setState: setValue,
}) => {
  const handleChange = ({ target }) => {
    setValue(target.value);
  };

  return (
    <StyledModalRow>
      <StyledP>파일 이름 :</StyledP>
      <StyledInput type="text" value={value} onChange={handleChange} />
    </StyledModalRow>
  );
};

export default TextInput;
