import React, { useState } from 'react';
import styled from 'styled-components';
import {
  BsArrowClockwise,
  BsArrowCounterclockwise,
  BsArrowRepeat,
} from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { getFile, getVisible } from '@/store/selectors';

import size from '@/theme/sizes';
import Logo from '@/components/atoms/Logo';
import ButtonGroup from '@/components/molecules/ButtonGroup';
import Modal from '@/components/molecules/Modal';
import videoAPI from '@/api/video';
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
  height: 50%;
  padding: 5%;
`;

const Header = () => {
  const videoFile = useSelector(getFile);
  const dispatch = useDispatch();
  const hasEmptyVideo = !useSelector(getVisible);
  const [complete, setComplete] = useState(false);

  const handlePrevious = () => {};
  const handleNext = () => {};
  const handleReset = () => {};
  const handleCancel = () => {
    dispatch(reset());
  };

  const handleConfirmComplete = async () => {
    dispatch(encodeStart(videoFile.name));
    setComplete(false);
  };

  const handleCancelComplete = async () => {
    setComplete(false);
  };

  const handleComplete = async () => {
    setComplete(true);
  };

  const handleVideoNameChange = () => {};

  const modalLayout = `
    top: 35vh;
    left: 35vw;
    width: 30vw;
    height: 30vh;
  `;
  const modalInnerComponent: React.FC = () => {
    return (
      <StyledModalRow>
        <p>파일 이름 :</p>
        <input
          type="text"
          value={videoFile?.name}
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
          handleOverlay={handleCancelComplete}
          handleButton1={handleCancelComplete}
          handleButton2={handleConfirmComplete}
          buttonMessage1="취소"
          buttonMessage2="확인"
          component={modalInnerComponent}
        />
      )}
    </StyledHeader>
  );
};

export default Header;
