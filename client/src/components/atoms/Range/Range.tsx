import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import webglController from '@/webgl/webglController';

const StyledInput = styled.input`
  position: absolute;
  left: 3rem;
  top: 1rem;
  transform: rotate(-90deg);
  width: 4rem;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
`;

const Range: React.FC = () => {
  const [value, setValue] = useState(25);

  const handleChange = useCallback(e => {
    const currentValue = e.target.value;
    webglController.setSignRatio(currentValue);
    setValue(currentValue);
  }, []);

  return (
    <StyledInput
      type="range"
      min="10"
      max="50"
      value={value}
      onChange={handleChange}
    />
  );
};

export default Range;
