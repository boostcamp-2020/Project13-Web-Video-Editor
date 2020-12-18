import React, { useMemo, useEffect } from 'react';
import styled from 'styled-components';

import color from '@/theme/colors';
import webglController from '@/webgl/webglController';
import Props from './props';

const StyledModalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  overflow-y: auto;
`;

const StyledModalCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem 1rem 1rem;
  width: 100%;
`;

const StyledInput = styled.input`
  width: ${({ type }) => (type === 'radio' ? null : '75%')};
  padding: 0.5rem;
  border-radius: 5px;
  border: none;
  box-shadow: ${({ type }) =>
    type === 'radio' ? null : '0 0 1px 2px rgba(255, 255, 255, 0.1)'};
  background-color: ${({ disabled }) => (disabled ? color.GRAY : color.MODAL)};
  color: ${color.WHITE};
  outline: none;
`;

const StyledP = styled.p`
  margin: 0;
  width: 25%;
  font-size: 12px;
  text-align: center;
`;

const StyledListP = styled(StyledP)`
  margin: 0;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const StyledLabel = styled.label`
  margin: 3% 0%;
  font-size: 14px;
  width: 100%;
  text-shadow: 0 0 5px 5px ${color.WHITE};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const RadioDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const MAX_RESOLUTION = 1920 * 1080;
const LEVELS = [1080, 720, 480, 360, 240];

const calculateResolution = (level, width, height) => ({
  other:
    Math.floor(
      (level * (width > height ? width / height : height / width)) / 2
    ) * 2,
  level,
});

const calculateResolutions = (width, height) => {
  const choices = {
    original: calculateResolution(
      width < height ? width : height,
      width,
      height
    ),
  };
  const sizes = {
    original: width * height,
  };

  LEVELS.forEach(level => {
    const choice = calculateResolution(level, width, height);
    choices[level] = choice;
    sizes[level] = choice.other * level;
  });

  return { choices, sizes };
};

interface State {
  name: string;
  radio: string | number;
}

const TextInput: React.FC<Props<State>> = ({ state, setState }) => {
  const resolutionWidth = webglController.originalWidth;
  const resolutionHeight = webglController.originalHeight;
  const { choices, sizes } = useMemo(
    () => calculateResolutions(resolutionWidth, resolutionHeight),
    [resolutionWidth, resolutionHeight]
  );

  useEffect(() => {
    webglController.setResolution(choices[state.radio]);
  }, [state.radio]);

  const handleTextInputChange = ({ target }) => {
    setState({
      radio: state.radio,
      name: target.value,
    });
  };

  const handleRadioInputChange = ({ target }) => {
    setState({
      radio: target.value,
      name: state.name,
    });
  };

  return (
    <>
      <StyledModalRow>
        <StyledP>파일 이름 :</StyledP>
        <StyledInput
          type="text"
          value={state.name}
          onChange={handleTextInputChange}
        />
      </StyledModalRow>
      <StyledModalCol>
        <RadioDiv>
          <StyledInput
            type="radio"
            name="resolution"
            id="resOriginal"
            value="original"
            onChange={handleRadioInputChange}
            checked={state.radio === 'original'}
            disabled={sizes.original > MAX_RESOLUTION}
          />
          <StyledLabel
            disabled={sizes.original > MAX_RESOLUTION}
            htmlFor="resOriginal"
          >
            원본
          </StyledLabel>
          <StyledListP disabled={sizes.original > MAX_RESOLUTION}>
            {`(${choices.original.other} x ${choices.original.level})`}
          </StyledListP>
        </RadioDiv>
        {LEVELS.map(level => {
          const disabled =
            sizes[level] > sizes.original || sizes[level] > MAX_RESOLUTION;
          return (
            <RadioDiv key={level}>
              <StyledInput
                type="radio"
                name="resolution"
                id={`res${level}`}
                value={level}
                onChange={handleRadioInputChange}
                checked={level.toString() === state.radio}
                disabled={disabled}
              />
              <StyledLabel disabled={disabled} htmlFor={`res${level}`}>
                {`${level}p`}
              </StyledLabel>
              <StyledListP disabled={disabled}>
                {`(${choices[level].other} x ${level})`}
              </StyledListP>
            </RadioDiv>
          );
        })}
      </StyledModalCol>
    </>
  );
};

export default TextInput;
