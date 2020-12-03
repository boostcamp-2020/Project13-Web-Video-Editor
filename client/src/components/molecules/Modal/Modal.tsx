import React from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/Button';
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
`;

const StyledModalButtonRow = styled.div`
  position: absolute;
  width: 100%;
  bottom: 1rem;
  margin-top: 1rem;
  text-align: center;

  button {
    color: ${color.WHITE};
  }
`;

interface Props {
  styleProps: string;
  handleOverlay: () => void;
  handleButton1: () => void;
  handleButton2: () => void;
  buttonMessage1: string;
  buttonMessage2: string;
  component: React.FC;
}

const Modal: React.FC<Props> = ({
  styleProps,
  handleOverlay,
  handleButton1,
  handleButton2,
  buttonMessage1,
  buttonMessage2,
  component: Component,
}) => {
  return (
    <StyledModal>
      <StyledModalOverlay onClick={handleOverlay} />
      <StyledModalSection styleProps={styleProps}>
        <Component />
        <StyledModalButtonRow>
          <Button
            type="transparent"
            message={buttonMessage1}
            onClick={handleButton1}
            disabled={false}
          />
          <Button
            type="transparent"
            message={buttonMessage2}
            onClick={handleButton2}
            disabled={false}
          />
        </StyledModalButtonRow>
      </StyledModalSection>
    </StyledModal>
  );
};

export default Modal;
