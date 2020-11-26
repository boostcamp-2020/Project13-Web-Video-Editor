import React from 'react';
import styled from 'styled-components';

import color from '@/theme/colors';

const StyledDiv = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  border-radius: 5px;
  padding: 5px 16px;
  top: 2rem;
  right: 0;
  background-color: ${color.GRAY};
  box-shadow: 1px 1px 2px 1px ${color.WHITE};
`;

const StyledLabel = styled.label`
  color: ${color.WHITE};
  font-size: 12px;
  cursor: pointer;
`;

const StyledInput = styled.input`
  display: none;
`;

interface Props {
  handleChange: () => void;
}

const FileInput = React.forwardRef<HTMLInputElement, Props>(
  ({ handleChange }, forwardedRef) => {
    return (
      <StyledDiv>
        <StyledLabel htmlFor="local">내 컴퓨터</StyledLabel>
        <StyledInput
          type="file"
          id="local"
          ref={forwardedRef}
          onChange={handleChange}
        />
      </StyledDiv>
    );
  }
);

export default FileInput;
