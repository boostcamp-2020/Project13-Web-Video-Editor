import React from 'react';
import styled from 'styled-components';

import color from '@/theme/colors';
import style from './style';
import { ButtonType } from '.';

interface StyledProps {
  buttonType: ButtonType;
}

const StyledButton = styled.button<StyledProps>`
  padding: 5px 16px;
  border: none;
  border-radius: 5px;
  color: ${color.WHITE};
  white-space: nowrap;
  cursor: pointer;
  ${({ buttonType }) => style(buttonType)}

  &:focus {
    outline: none;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:hover {
    background-color: ${color.BORDER};
    box-shadow: 0 0 10px 8px rgba(255, 255, 255, 0.2);
  }
`;

interface Props {
  children?: React.ReactChild;
  message: string;
  onClick?: () => void;
  type: ButtonType;
  disabled: boolean;
}

const Button: React.FC<Props> = ({
  children,
  message,
  onClick,
  type,
  disabled,
}) => (
  <StyledButton buttonType={type} onClick={onClick} disabled={disabled}>
    {children}
    {children && <br />}
    {message}
  </StyledButton>
);

export default Button;
