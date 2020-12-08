import React from 'react';
import { BsTerminal, BsCheck, BsX } from 'react-icons/bs';
import {
  MdRotateLeft,
  MdRotateRight,
  MdZoomIn,
  MdZoomOut,
} from 'react-icons/md';
import { CgMergeHorizontal, CgMergeVertical } from 'react-icons/cg';

import size from '@/theme/sizes';

export enum ButtonTypes {
  crop = 'crop',
  videoEffect = 'videoEffect',
  ratio = 'ratio',
  sign = 'sign',
}

export interface ButtonData {
  onClicks: (() => void)[];
  messages: string[];
  type: 'default' | 'transparent';
  childrens: React.ReactChild[];
}

interface ButtonDataAction {
  type: ButtonTypes | null;
  payload?: (() => void)[];
}

// crop
const cropMessages = ['직접입력', '확인', '취소'];
const cropChildrens = [
  <BsTerminal size={size.ICON_SIZE} />,
  <BsCheck size={size.ICON_SIZE} />,
  <BsX size={size.ICON_SIZE} />,
];

// videoEffect
const rotateReverseMessages = ['왼쪽', '오른쪽', '상하 반전', '좌우 반전'];
const rotateReverseChildrens = [
  <MdRotateLeft size={size.ICON_SIZE} />,
  <MdRotateRight size={size.ICON_SIZE} />,
  <CgMergeHorizontal size={size.ICON_SIZE} />,
  <CgMergeVertical size={size.ICON_SIZE} />,
];

// ratio
const ratioMessages = ['확대', '축소'];
const ratioChildrens = [
  <MdZoomIn size={size.ICON_SIZE} />,
  <MdZoomOut size={size.ICON_SIZE} />,
];

export const initialData: ButtonData = {
  onClicks: [],
  messages: [],
  type: 'transparent',
  childrens: [],
};

export default (state: ButtonData, action: ButtonDataAction): ButtonData => {
  switch (action.type) {
    case ButtonTypes.crop:
      return {
        onClicks: action.payload,
        messages: cropMessages,
        type: 'transparent',
        childrens: cropChildrens,
      };
    case ButtonTypes.videoEffect:
      return {
        onClicks: action.payload,
        messages: rotateReverseMessages,
        type: 'transparent',
        childrens: rotateReverseChildrens,
      };
    case ButtonTypes.ratio:
      return {
        onClicks: action.payload,
        messages: ratioMessages,
        type: 'transparent',
        childrens: ratioChildrens,
      };
    default:
      return initialData;
  }
};
