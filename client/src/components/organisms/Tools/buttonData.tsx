import React from 'react';

import {
  BsFillSkipStartFill,
  BsFillSkipEndFill,
  BsFillPlayFill,
  BsFillPauseFill,
  BsAspectRatio,
  BsFillVolumeMuteFill,
  BsFillVolumeDownFill,
  BsFillVolumeUpFill,
} from 'react-icons/bs';
import { RiScissorsLine, RiCopyrightLine } from 'react-icons/ri';
import { MdScreenRotation } from 'react-icons/md';
import { VscSymbolColor } from 'react-icons/vsc';

import size from '@/theme/sizes';

import color from '@/theme/colors';
import { ButtonData, ButtonTypes } from './reducer';

interface button {
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  message: string;
  type: 'default' | 'transparent' | 'selected';
  children: React.ReactChild;
  disabled?: boolean;
}

const selectVolumeIcon = volume => {
  if (volume > 0.5) {
    return <BsFillVolumeUpFill size={size.BIG_ICON_SIZE} />;
  }
  if (volume > 0) {
    return <BsFillVolumeDownFill size={size.BIG_ICON_SIZE} />;
  }
  return <BsFillVolumeMuteFill size={size.BIG_ICON_SIZE} />;
};

export const getVideoToolsData = (
  backwardVideo: () => void,
  playPauseVideo: () => void,
  forwardVideo: () => void,
  handleVolumeControllerClick: () => void,
  handleVolumeControllerMouseEnter: () => void,
  handleVolumeControllerMouseLeave: () => void,
  volume: number,
  play: boolean,
  hasEmptyVideo: boolean
): button[] => [
  {
    onClick: backwardVideo,
    message: '',
    type: 'transparent',
    children: <BsFillSkipStartFill size={size.BIG_ICON_SIZE} />,
    disabled: hasEmptyVideo,
  },
  {
    onClick: playPauseVideo,
    message: '',
    type: 'transparent',
    children: play ? (
      <BsFillPauseFill size={size.BIG_ICON_SIZE} />
    ) : (
      <BsFillPlayFill size={size.BIG_ICON_SIZE} />
    ),
    disabled: hasEmptyVideo,
  },
  {
    onClick: forwardVideo,
    message: '',
    type: 'transparent',
    children: <BsFillSkipEndFill size={size.BIG_ICON_SIZE} />,
    disabled: hasEmptyVideo,
  },
  {
    onClick: handleVolumeControllerClick,
    onMouseEnter: handleVolumeControllerMouseEnter,
    onMouseLeave: handleVolumeControllerMouseLeave,
    message: '',
    type: 'transparent',
    children: selectVolumeIcon(volume),
    disabled: hasEmptyVideo,
  },
];

export const getEditToolData = (
  rotateReverse: () => void,
  ratio: () => void,
  crop: () => void,
  sign: () => void,
  filter: () => void,
  hasEmptyVideo: boolean,
  toolType: ButtonTypes
): button[] => [
  {
    onClick: rotateReverse,
    message: '회전 / 반전',
    type: toolType === ButtonTypes.videoEffect ? 'selected' : 'transparent',
    children: (
      <MdScreenRotation
        size={size.ICON_SIZE}
        color={
          toolType === ButtonTypes.videoEffect ? color.PALE_PURPLE : undefined
        }
      />
    ),
    disabled: hasEmptyVideo,
  },
  {
    onClick: ratio,
    message: '비율',
    type: toolType === ButtonTypes.ratio ? 'selected' : 'transparent',
    children: (
      <BsAspectRatio
        size={size.ICON_SIZE}
        color={toolType === ButtonTypes.ratio ? color.PALE_PURPLE : undefined}
      />
    ),
    disabled: hasEmptyVideo,
  },
  {
    onClick: crop,
    message: '자르기',
    type: toolType === ButtonTypes.crop ? 'selected' : 'transparent',
    children: (
      <RiScissorsLine
        size={size.ICON_SIZE}
        color={toolType === ButtonTypes.crop ? color.PALE_PURPLE : undefined}
      />
    ),
    disabled: hasEmptyVideo,
  },
  {
    onClick: sign,
    message: '서명',
    type: toolType === ButtonTypes.sign ? 'selected' : 'transparent',
    children: (
      <RiCopyrightLine
        size={size.ICON_SIZE}
        color={toolType === ButtonTypes.sign ? color.PALE_PURPLE : undefined}
      />
    ),
    disabled: hasEmptyVideo,
  },
  {
    onClick: filter,
    message: '필터',
    type: toolType === ButtonTypes.filter ? 'selected' : 'transparent',
    children: (
      <VscSymbolColor
        size={size.ICON_SIZE}
        color={toolType === ButtonTypes.filter ? color.PALE_PURPLE : undefined}
      />
    ),
    disabled: hasEmptyVideo,
  },
];

export const getSubEditToolsData = (buttonData: ButtonData): button[] =>
  [...Array(buttonData.onClicks?.length)].map((_, idx) => ({
    onClick: buttonData.onClicks[idx],
    message: buttonData.messages[idx],
    type: buttonData.type,
    children: buttonData.childrens[idx],
  }));
