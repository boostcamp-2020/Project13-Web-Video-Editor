import React, { useState } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/Button';
import { ComponentProps } from '@/components/atoms/ModalComponent';
import color from '@/theme/colors';

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`;

const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.3);
`;

const StyledModalSection = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  ${({ styleProps }) => styleProps}
  background-color: ${color.MODAL};
  border-radius: 12px;
  box-shadow: 0 0 10px 8px rgba(255, 255, 255, 0.2);
  color: ${color.WHITE};
  z-index: 3;
  margin-bottom: 1rem;
`;

const StyledModalButtonRow = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0.5rem;
  padding-top: 0.5rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid ${color.BORDER};

  button {
    color: ${color.WHITE};
    padding: 0.5rem 2rem;
    border-radius: 40%;
    &:hover {
      background-color: ${color.BORDER};
      box-shadow: 0 0 10px 8px rgba(255, 255, 255, 0.2);
    }
  }
`;

interface Props<T> {
  styleProps: string;
  handleOverlay: () => void;
  handleCancel: () => void;
  handleConfirm: (state: T) => void;
  component: React.FC<ComponentProps<T>>;
  initialState: T;
}

const Modal: React.FC<Props<unknown>> = ({
  styleProps,
  handleOverlay,
  handleCancel,
  handleConfirm,
  component: Component,
  initialState,
}) => {
  const [state, setState] = useState(initialState);

  return (
    <StyledModal>
      <StyledModalOverlay onClick={handleOverlay} />
      <StyledModalSection styleProps={styleProps}>
        <Component state={state} setState={setState} />
        <StyledModalButtonRow>
          <Button
            type="transparent"
            message="취소"
            onClick={handleCancel}
            disabled={false}
          />
          <Button
            type="transparent"
            message="확인"
            onClick={() => handleConfirm(state)}
            disabled={!state}
          />
        </StyledModalButtonRow>
      </StyledModalSection>
    </StyledModal>
  );
};

export default Modal;
