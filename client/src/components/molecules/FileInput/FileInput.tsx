import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

import Modal from '@/components/molecules/Modal';
import VideoList from '@/components/atoms/VideoList';
import color from '@/theme/colors';

const slide = keyframes`
  from {
    transform: translate(0, -50px) rotate(90deg);
    opacity: 0;
  }
  to {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
`;

const StyledDiv = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 5px;
  top: 2rem;
  right: 0;
  border: 1px solid ${color.BORDER};
  background-color: ${color.BLACK};
  box-shadow: 1px 1px 2px 1px ${color.BORDER};
  animation: ${slide} 0.4s -0.1s ease-out;
  transform-origin: center center;
  width: 5rem;
`;

const FromLocal = styled.label`
  color: ${color.WHITE};
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  padding: 5px 16px;
  transition: 0.7s;
  border-radius: 5px 5px 0 0;

  &:hover {
    background-color: ${color.GRAY};
  }
`;

const FromServer = styled(FromLocal)`
  border-top: 1px solid ${color.BORDER};
  border-radius: 0 0 5px 5px;
`;

const StyledInput = styled.input`
  display: none;
`;

interface Props {
  handleChange: () => void;
}

const modalLayout = `
  top: 20vh;
  left: 35vw;
  width: 30vw;
  height: 60vh;
`;

const FileInput = React.forwardRef<HTMLInputElement, Props>(
  ({ handleChange }, forwardedRef) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleClick = async () => setModalVisible(true);
    const handleCancel = () => setModalVisible(false);
    const handleConfirm = () => setModalVisible(false);

    const handleOverlay = () => setModalVisible(false);
    return (
      <StyledDiv>
        {modalVisible && (
          <Modal
            styleProps={modalLayout}
            handleOverlay={handleOverlay}
            handleButton1={handleCancel}
            handleButton2={handleConfirm}
            buttonMessage1="취소"
            buttonMessage2="확인"
            component={VideoList}
          />
        )}
        <FromLocal htmlFor="local">로컬</FromLocal>
        <StyledInput
          type="file"
          id="local"
          ref={forwardedRef}
          onChange={handleChange}
        />
        <FromServer onClick={handleClick}>서버</FromServer>
      </StyledDiv>
    );
  }
);

export default FileInput;
