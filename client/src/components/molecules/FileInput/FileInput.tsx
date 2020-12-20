import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Modal from '@/components/molecules/Modal';
import { VideoList } from '@/components/atoms/ModalComponent';
import color from '@/theme/colors';
import { Video } from '@/store/video/actions';
import { fetchStart } from '@/store/originalVideo/actions';

const slide = keyframes`
  from {
    transform: translate(0, -2rem) rotate(90deg);
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
  top: 3rem;
  right: 0;
  border: 1px solid ${color.BORDER};
  background-color: ${color.BLACK};
  box-shadow: 1px 1px 2px 1px ${color.BORDER};
  animation: ${slide} 0.4s -0.1s ease-out;
  transform-origin: center center;
  width: 5rem;
  z-index: 5;
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
  left: 30vw;
  width: 40vw;
  height: 60vh;
`;
const FileInput = React.forwardRef<HTMLInputElement, Props>(
  ({ handleChange }, forwardedRef) => {
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const handleClick = () => setModalVisible(true);
    const handleCancel = () => setModalVisible(false);
    const handleConfirm = (video: Video) => {
      dispatch(fetchStart(video));
      setModalVisible(false);
    };

    return (
      <StyledDiv>
        {modalVisible && (
          <Modal
            styleProps={modalLayout}
            handleOverlay={handleCancel}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
            component={VideoList}
            initialState={null}
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
