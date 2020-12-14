import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import webglController from '@/webgl/webglController';

interface Props {
  id: string;
}

const StyledInput = styled.input`
  width: 4rem;
  background-color: ${({ color }) => color} !important;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
  margin: 10% 0%;
`;

const Range: React.FC<Props> = ({ id }) => {
  const [value, setValue] = useState(100);

  const handleChange = useCallback(e => {
    const currentValue = e.target.value;
    switch (e.target.id) {
      case 'red':
        webglController.setChromaRed(currentValue / 100);
        break;
      case 'green':
        webglController.setChromaGreen(currentValue / 100);
        break;
      case 'blue':
        webglController.setChromaBlue(currentValue / 100);
        break;
      case 'blur':
        webglController.setBlur(currentValue / 100);
        break;
      default:
        break;
    }
    setValue(currentValue);
  }, []);

  return (
    <StyledInput
      id={id}
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={handleChange}
      color={id}
    />
  );
};

export default Range;
