import React from 'react';
import styled from 'styled-components';
import {
  BsArrowClockwise,
  BsArrowCounterclockwise,
  BsArrowRepeat,
} from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { getFile } from '@/store/selectors';

import size from '@/theme/sizes';
import Logo from '@/components/atoms/Logo';
import ButtonGroup from '@/components/molecules/ButtonGroup';
import videoAPI from '@/api/video';
import { reset } from '@/store/actionTypes';

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
}

const getHistoryToolData = (
  handlePrevious: () => void,
  handleNext: () => void,
  handleReset: () => void
): button[] => [
  {
    onClick: handlePrevious,
    message: '이전',
    type: 'transparent',
    children: <BsArrowClockwise size={size.ICON_SIZE} />,
  },
  {
    onClick: handleNext,
    message: '다음',
    type: 'transparent',
    children: <BsArrowCounterclockwise size={size.ICON_SIZE} />,
  },
  {
    onClick: handleReset,
    message: '원본으로',
    type: 'transparent',
    children: <BsArrowRepeat size={size.ICON_SIZE} />,
  },
];

const getCancelConfirmData = (
  handleCancel: () => void,
  handleConfirm: () => void
): button[] => [
  {
    onClick: handleCancel,
    message: '취소',
    type: 'default',
    children: null,
  },
  {
    onClick: handleConfirm,
    message: '완료',
    type: 'default',
    children: null,
  },
];

const HistoryTool = styled(ButtonGroup)``;

const CancelConfirm = styled(ButtonGroup)``;
const CancelConfirmStyle = `
  button {
    margin-left: 2rem;
  }
`;

const Header = () => {
  const videoFile = useSelector(getFile);
  const dispatch = useDispatch();

  const handlePrevious = () => {};
  const handleNext = () => {};
  const handleReset = () => {};
  const handleCancel = () => {
    dispatch(reset());
  };

  const handleConfirm = async () => {
    const formData = new FormData();
    formData.append('video', videoFile);

    const {
      data: { url },
    } = await videoAPI.upload(formData);
  };

  return (
    <StyledHeader>
      <Logo />
      <HistoryTool
        buttonData={getHistoryToolData(handlePrevious, handleNext, handleReset)}
      />
      <CancelConfirm
        StyledProps={CancelConfirmStyle}
        buttonData={getCancelConfirmData(handleCancel, handleConfirm)}
      />
    </StyledHeader>
  );
};

export default Header;
