import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import Color from '@/theme/colors';
import webglController from '@/webgl/webglController';
import { applyFilter } from '@/store/history/actions';

interface Props {
  id: string;
}

const StyledInput = styled.input`
  width: 4rem;
  background: ${({ color, value }) => {
    switch (color) {
      case 'red':
      case 'green':
      case 'blue':
        return `linear-gradient(0.25turn, ${Color.BLACK}, ${color})`;
      case 'luminance':
        return `linear-gradient(0.25turn, ${Color.BLACK}, ${Color.WHITE})`;
      case 'blur':
        return 'transparent';
      case 'grayScale':
        return value === '1'
          ? Color.GRAY
          : `linear-gradient(0.25turn, ${Color.ORIGINAL_RED}, ${Color.ORIGINAL_RED}, ${Color.ORIGINAL_ORANGE},
            ${Color.ORIGINAL_YELLOW}, ${Color.ORIGINAL_GREEN}, ${Color.ORIGINAL_BLUE},
            ${Color.ORIGINAL_DARK_BLUE}, ${Color.ORIGINAL_VIOLET})`;
      default:
        return null;
    }
  }} !important;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
  margin: 10% 0%;
`;

const Range: React.FC<Props> = ({ id }) => {
  let res = 100;
  let max = 100;

  if (id === 'blur') {
    res = 0;
  } else if (id === 'luminance') {
    res = 50;
  } else if (id === 'grayScale') {
    res = 0;
    max = 1;
  }

  const dispatch = useDispatch();

  const [value, setValue] = useState(res);

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
        dispatch(applyFilter({ blur: currentValue / 50 }));
        webglController.setBlur(currentValue / 100);
        break;
      case 'luminance':
        dispatch(applyFilter({ brightness: currentValue / 50 }));
        webglController.setLuminance((currentValue - 50) / 100);
        break;
      case 'grayScale':
        if (currentValue === '1') {
          dispatch(applyFilter({ grayScale: 100 }));
        } else {
          dispatch(applyFilter({ grayScale: 0 }));
        }
        webglController.setGrayScale(currentValue);
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
      max={max}
      value={value}
      onChange={handleChange}
      color={id}
    />
  );
};

export default Range;
