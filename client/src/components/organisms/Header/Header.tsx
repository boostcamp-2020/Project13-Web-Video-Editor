import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
  BsArrowClockwise,
  BsArrowCounterclockwise,
  BsArrowRepeat,
} from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import {
  getName,
  getVisible,
  getIsPrevDisabled,
  getIsNextDisabled,
} from '@/store/selectors';

import size from '@/theme/sizes';
import Logo from '@/components/atoms/Logo';
import { TextInput } from '@/components/atoms/ModalComponent';
import ButtonGroup from '@/components/molecules/ButtonGroup';
import Modal from '@/components/molecules/Modal';
import color from '@/theme/colors';
import { reset } from '@/store/actionTypes';
import { encodeStart } from '@/store/originalVideo/actions';
import { undo, redo, clear } from '@/store/history/actions';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  padding: 0 2rem 0 1rem;
  background-color: ${color.VIDEO};
  border-bottom: 1px solid ${color.BORDER};
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
  hasEmptyVideo: boolean,
  isPrevDisabled: boolean,
  isNextDisabled: boolean
): button[] => [
  {
    onClick: handlePrevious,
    message: '이전',
    type: 'transparent',
    children: <BsArrowClockwise size={size.ICON_SIZE} />,
    disabled: hasEmptyVideo || isPrevDisabled,
  },
  {
    onClick: handleNext,
    message: '다음',
    type: 'transparent',
    children: <BsArrowCounterclockwise size={size.ICON_SIZE} />,
    disabled: hasEmptyVideo || isNextDisabled,
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

const HistoryWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 20rem;
  position: absolute;
  left: calc(50% - 10rem);
`;

const CancelConfirm = styled(ButtonGroup)``;
const CancelConfirmStyle = `
  button {
    margin-left: 2rem;
  }
`;

const modalLayout = `
top: 35vh;
left: 40vw;
width: 20vw;
height: 12vh;
`;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const name = useSelector(getName);
  const hasEmptyVideo = !useSelector(getVisible);
  const isPrevDisabled = useSelector(getIsPrevDisabled);
  const isNextDisabled = useSelector(getIsNextDisabled);

  const handlePrevious = () => {
    dispatch(undo());
  };
  const handleNext = () => {
    dispatch(redo());
  };
  const handleReset = () => {
    dispatch(clear());
  };
  const handleCancel = () => dispatch(reset());

  const handleModalConfirm = fileName => {
    dispatch(encodeStart(fileName));
    setModalVisible(false);
  };

  const handleModalCancel = () => setModalVisible(false);
  const handleComplete = () => setModalVisible(true);

  return (
    <StyledHeader>
      <Logo />
      <HistoryWrapper>
        <HistoryTool
          buttonData={getHistoryToolData(
            handlePrevious,
            handleNext,
            handleReset,
            hasEmptyVideo,
            isPrevDisabled,
            isNextDisabled
          )}
        />
      </HistoryWrapper>
      <CancelConfirm
        StyledProps={CancelConfirmStyle}
        buttonData={getCancelConfirmData(
          handleCancel,
          handleComplete,
          hasEmptyVideo
        )}
      />
      {modalVisible && (
        <Modal
          styleProps={modalLayout}
          handleOverlay={handleModalCancel}
          handleCancel={handleModalCancel}
          handleConfirm={handleModalConfirm}
          component={TextInput}
          initialState={name}
        />
      )}
    </StyledHeader>
  );
};

export default Header;
