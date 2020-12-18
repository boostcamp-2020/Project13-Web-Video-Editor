import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import color from '@/theme/colors';
import webglController from '@/webgl/webglController';
import { applyFilter, Filter } from '@/store/history/actions';
import {
  getRed,
  getGreen,
  getBlue,
  getBrightness,
  getBlur,
  getGrayscale,
} from '@/store/selectors';

interface Props {
  filter: Filter;
}

const filterMapper = {
  [Filter.RED]: {
    selector: getRed,
    max: 100,
    action: value => applyFilter({ [Filter.RED]: value }),
    sideEffect: value => webglController.setChromaRed(value / 100), // 0 ~ 1
    background: `linear-gradient(0.25turn, ${color.BLACK}, ${color.ORIGINAL_RED})`,
  },
  [Filter.GREEN]: {
    selector: getGreen,
    max: 100,
    action: value => applyFilter({ [Filter.GREEN]: value }),
    sideEffect: value => webglController.setChromaGreen(value / 100), // 0 ~ 1
    background: `linear-gradient(0.25turn, ${color.BLACK}, ${color.ORIGINAL_GREEN})`,
  },
  [Filter.BLUE]: {
    selector: getBlue,
    max: 100,
    action: value => applyFilter({ [Filter.BLUE]: value }),
    sideEffect: value => webglController.setChromaBlue(value / 100), // 0 ~ 1
    background: `linear-gradient(0.25turn, ${color.BLACK}, ${color.ORIGINAL_BLUE})`,
  },
  [Filter.LUMINANCE]: {
    selector: getBrightness,
    max: 100,
    action: value => applyFilter({ [Filter.LUMINANCE]: value }),
    sideEffect: value => webglController.setLuminance((value - 50) / 100), // -0.5 ~ 0.5
    background: `linear-gradient(0.25turn, ${color.BLACK}, ${color.WHITE})`,
  },
  [Filter.BLUR]: {
    selector: getBlur,
    max: 100,
    action: value => applyFilter({ [Filter.BLUR]: value }),
    sideEffect: value => webglController.setBlur(value / 100), // 0 ~ 1
    background: `transparent`,
  },
  [Filter.GRAYSCALE]: {
    selector: getGrayscale,
    max: 1,
    action: value => applyFilter({ [Filter.GRAYSCALE]: value }),
    sideEffect: value => webglController.setGrayScale(value),
    background: value =>
      value
        ? `${color.GRAY}`
        : `linear-gradient(0.25turn, ${color.ORIGINAL_RED}, ${color.ORIGINAL_RED}, ${color.ORIGINAL_ORANGE},
      ${color.ORIGINAL_YELLOW}, ${color.ORIGINAL_GREEN}, ${color.ORIGINAL_BLUE},
      ${color.ORIGINAL_DARK_BLUE}, ${color.ORIGINAL_VIOLET})`,
  },
};

const StyledInput = styled.input`
  width: 4rem;
  background: ${({ id, background, value }) =>
    id === Filter.GRAYSCALE ? background(value) : background} !important;

  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
  margin: 10% 0%;
`;

const Range: React.FC<Props> = ({ filter }) => {
  const { selector, max, action, sideEffect, background } = filterMapper[
    filter
  ];

  const dispatch = useDispatch();
  const value = useSelector(selector);

  const handleChange = useCallback(
    ({ target }) => {
      const currentValue = Number(target.value);
      dispatch(action(currentValue));
      sideEffect(currentValue);
    },
    [filter]
  );

  return (
    <StyledInput
      id={filter}
      type="range"
      min="0"
      max={max}
      value={value}
      onChange={handleChange}
      background={background}
    />
  );
};

export default Range;
