import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
  BsArrowClockwise,
  BsArrowCounterclockwise,
  BsArrowRepeat,
} from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { getName, getVisible } from '@/store/selectors';

import size from '@/theme/sizes';
import Logo from '@/components/atoms/Logo';
import ButtonGroup from '@/components/molecules/ButtonGroup';
import Modal from '@/components/molecules/Modal';
import color from '@/theme/colors';
import { reset } from '@/store/actionTypes';
import { encodeStart } from '@/store/originalVideo/actions';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  padding: 0 2rem 0 1rem;
`;

interface button {
  onClick: () => void;
  message: string;
  type: 'default' | 'transparent';
  children: React.ReactChild;
  disabled: boolean;
}

const getHistoryToolData = (
  handlePrevious: () => void,
  handleNext: () => void,
  handleReset: () => void,
  hasEmptyVideo: boolean
): button[] => [
  {
    onClick: handlePrevious,
    message: '이전',
    type: 'transparent',
    children: <BsArrowClockwise size={size.ICON_SIZE} />,
    disabled: hasEmptyVideo,
  },
  {
    onClick: handleNext,
    message: '다음',
    type: 'transparent',
    children: <BsArrowCounterclockwise size={size.ICON_SIZE} />,
    disabled: hasEmptyVideo,
  },
  {
    onClick: handleReset,
    message: '원본으로',
    type: 'transparent',
    children: <BsArrowRepeat size={size.ICON_SIZE} />,
    disabled: hasEmptyVideo,
  },
];

const getCancelConfirmData = (
  handleCancel: () => void,
  handleConfirm: () => void,
  hasEmptyVideo: boolean
): button[] => [
  {
    onClick: handleCancel,
    message: '취소',
    type: 'default',
    children: null,
    disabled: hasEmptyVideo,
  },
  {
    onClick: handleConfirm,
    message: '완료',
    type: 'default',
    children: null,
    disabled: hasEmptyVideo,
  },
];

const HistoryTool = styled(ButtonGroup)``;

const CancelConfirm = styled(ButtonGroup)``;
const CancelConfirmStyle = `
  button {
    margin-left: 2rem;
  }
`;

const StyledModalRow = styled.div`
  display: flex;
  align-items: center;
  padding: 5%;
`;

const StyledInput = styled.input`
  margin-left: 5px;
  padding: 5px;
  border-radius: 5px;
  border: none;
  box-shadow: 0 0 1px 2px rgba(255, 255, 255, 0.1);
  background-color: ${color.MODAL};
  color: ${color.WHITE};
`;

const StyledP = styled.p`
  margin: 0;
  font-size: 12px;
`;

const modalLayout = `
top: 45vh;
left: 40vw;
width: 20vw;
height: 10vh;
`;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const [complete, setComplete] = useState(false);
  const name = useSelector(getName);
  const hasEmptyVideo = !useSelector(getVisible);
  const inputRef = useRef(null);

  const handlePrevious = () => {};
  const handleNext = () => {};
  const handleReset = () => {};
  const handleCancel = () => dispatch(reset());

  const handleModalConfirm = () => {
    dispatch(encodeStart(inputRef.current.value));
    setComplete(false);
  };

  const handleModalCancel = () => setComplete(false);
  const handleComplete = () => setComplete(true);

  const modalInnerComponent = () => {
    const [value, setValue] = useState(name);

    const handleVideoNameChange = ({ target }) => {
      setValue(target.value);
    };

    return (
      <StyledModalRow>
        <StyledP>파일 이름 :</StyledP>
        <StyledInput
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleVideoNameChange}
        />
      </StyledModalRow>
    );
  };

  return (
    <StyledHeader>
      <Logo />
      <HistoryTool
        buttonData={getHistoryToolData(
          handlePrevious,
          handleNext,
          handleReset,
          hasEmptyVideo
        )}
      />
      <CancelConfirm
        StyledProps={CancelConfirmStyle}
        buttonData={getCancelConfirmData(
          handleCancel,
          handleComplete,
          hasEmptyVideo
        )}
      />
      {complete && (
        <Modal
          styleProps={modalLayout}
          handleOverlay={handleModalCancel}
          handleButton1={handleModalCancel}
          handleButton2={handleModalConfirm}
          buttonMessage1="취소"
          buttonMessage2="확인"
          component={modalInnerComponent}
        />
      )}
    </StyledHeader>
  );
};

export default Header;
