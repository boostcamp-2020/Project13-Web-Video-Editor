import React from 'react';

import {
  BsFillSkipStartFill,
  BsFillSkipEndFill,
  BsFillPlayFill,
  BsFillPauseFill,
  BsAspectRatio,
} from 'react-icons/bs';
import { RiScissorsLine } from 'react-icons/ri';
import { MdScreenRotation } from 'react-icons/md';

import size from '@/theme/sizes';

import { ButtonData } from './reducer';

interface button {
  onClick: () => void;
  message: string;
  type: 'default' | 'transparent';
  children: React.ReactChild;
}

export const getVideoToolsData = (
  backwardVideo: () => void,
  playPauseVideo: () => void,
  forwardVideo: () => void,
  play: boolean
): button[] => [
  {
    onClick: backwardVideo,
    message: '',
    type: 'transparent',
    children: <BsFillSkipStartFill size={size.BIG_ICON_SIZE} />,
  },
  {
    onClick: playPauseVideo,
    message: '',
    type: 'transparent',
    children: play ? (
      <BsFillPlayFill size={size.BIG_ICON_SIZE} />
    ) : (
      <BsFillPauseFill size={size.BIG_ICON_SIZE} />
    ),
  },
  {
    onClick: forwardVideo,
    message: '',
    type: 'transparent',
    children: <BsFillSkipEndFill size={size.BIG_ICON_SIZE} />,
  },
];

export const getEditToolData = (
  rotateReverse: () => void,
  ratio: () => void,
  crop: () => void
): button[] => [
  {
    onClick: rotateReverse,
    message: '회전 / 반전',
    type: 'transparent',
    children: <MdScreenRotation size={size.ICON_SIZE} />,
  },
  {
    onClick: ratio,
    message: '비율',
    type: 'transparent',
    children: <BsAspectRatio size={size.ICON_SIZE} />,
  },
  {
    onClick: crop,
    message: '자르기',
    type: 'transparent',
    children: <RiScissorsLine size={size.ICON_SIZE} />,
  },
];

export const getSubEditToolsData = (buttonData: ButtonData): button[] =>
  [...Array(buttonData.onClicks?.length)].map((_, idx) => ({
    onClick: buttonData.onClicks[idx],
    message: buttonData.messages[idx],
    type: buttonData.type,
    children: buttonData.childrens[idx],
  }));
