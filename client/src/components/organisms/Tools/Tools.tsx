import React, { useState, useReducer, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Effect, applyEffect } from '@/store/history/actions';
import ButtonGroup from '@/components/molecules/ButtonGroup';
import UploadArea from '@/components/molecules/UploadArea';
import video from '@/video';
import { play, pause, moveTo } from '@/store/currentVideo/actions';
import { getStartEnd, getPlaying, getVisible } from '@/store/selectors';
import { cropStart, cropCancel, cropConfirm } from '@/store/crop/actions';
import webglController from '@/webgl/webglController';
import reducer, { initialData, ButtonTypes } from './reducer';
import {
  getEditToolData,
  getSubEditToolsData,
  getVideoToolsData,
} from './buttonData';

const UP = 'up';
const DOWN = 'down';

const StyledDiv = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  padding: 1rem;
  height: 5.5rem;
`;

const slide = keyframes`
  from {
    transform: translate(0, 2rem);
    opacity: 0;
  }
  to {
    transform: translate(0, -1.5rem);
    opacity: 1;
  }
`;

const StyledEditToolDiv = styled.div`
  display: flex;
  width: 20rem;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: calc(50% - 10rem);
`;

const EditTool = styled(ButtonGroup)`
  width: 20rem;
`;

const WrapperDiv = styled.div`
  width: 25rem;
  display: flex;
  justify-content: center;
  animation: ${slide} 0.5s -0.2s ease-out;
  ${({ isEdit }) =>
    `transform: ${
      isEdit === UP ? `translate(0, -1.5rem)` : `translate(0, 0)`
    }`};
`;

const SubEditTool = styled(ButtonGroup)`
  width: 100%;
`;

const VideoTool = styled(ButtonGroup)`
  display: flex;
`;

interface props {
  setEdit: Function;
  isEdit: string;
}

const Tools: React.FC<props> = ({ setEdit, isEdit }) => {
  const playing = useSelector(getPlaying);
  const dispatch = useDispatch();
  const [toolType, setToolType] = useState(null);
  const [buttonData, dispatchButtonData] = useReducer(reducer, initialData);
  const hasEmptyVideo = !useSelector(getVisible);

  const { start, end } = useSelector(getStartEnd, shallowEqual);

  const backwardVideo = () => {
    let dstTime = video.get('currentTime') - 10;
    if (dstTime < start) {
      dstTime = start;
      if (playing) {
        dispatch(pause());
        dispatch(play());
      }
    }
    video.setCurrentTime(dstTime);
    dispatch(moveTo(dstTime));
  };

  const forwardVideo = () => {
    let dstTime = video.get('currentTime') + 10;
    if (dstTime > end) {
      dstTime = end;
      video.pause();
      dispatch(pause());
    }
    video.setCurrentTime(dstTime);
    dispatch(moveTo(dstTime));
  };

  const playPauseVideo = () => {
    if (!playing) {
      // NOTE: playing을 바꿔서 slider의 useEffect를 통해 다시 렌더링하기 위함
      video.play();
      dispatch(play());
    } else {
      video.pause();
      dispatch(moveTo(video.get('currentTime')));
      dispatch(pause());
    }
  };

  document.onkeydown = (event: KeyboardEvent) => {
    const element = document.activeElement as HTMLButtonElement;
    if (element.tagName !== 'INPUT') element.blur();

    switch (event.code) {
      case 'ArrowLeft':
        backwardVideo();
        break;
      case 'Space':
        playPauseVideo();
        break;
      case 'ArrowRight':
        forwardVideo();
        break;
      default:
        break;
    }
  };

  const closeSubtool = () => {
    setEdit(DOWN);
    setToolType(null);
    dispatchButtonData({ type: null });
  };

  const openSubtool = (type: ButtonTypes, payload: (() => void)[]) => {
    if (type !== ButtonTypes.crop) dispatch(cropCancel());
    setEdit(UP);
    setToolType(type);
    dispatchButtonData({ type, payload });
  };

  const handleCropManually = useCallback(() => {}, []); // TODO:
  const handleCropConfirm = useCallback(() => {
    dispatch(cropConfirm());
    closeSubtool();
  }, [dispatch]);
  const handleCropCancel = useCallback(() => {
    dispatch(cropCancel());
    closeSubtool();
  }, [dispatch]);

  const methods = useMemo(
    () => ({
      rotateReverse: [
        () => dispatch(applyEffect(Effect.RotateCounterClockwise)),
        () => dispatch(applyEffect(Effect.RotateClockwise)),
        () => dispatch(applyEffect(Effect.FlipHorizontal)),
        () => dispatch(applyEffect(Effect.FlipVertical)),
      ],
      ratio: [
        () => dispatch(applyEffect(Effect.Enlarge)),
        () => dispatch(applyEffect(Effect.Reduce)),
      ],
      crop: [handleCropManually, handleCropConfirm, handleCropCancel],
    }),
    []
  );

  const handleRotateReverse = () =>
    toolType === ButtonTypes.videoEffect
      ? closeSubtool()
      : openSubtool(ButtonTypes.videoEffect, methods.rotateReverse);

  const handleRatio = () =>
    toolType === ButtonTypes.ratio
      ? closeSubtool()
      : openSubtool(ButtonTypes.ratio, methods.ratio);

  const handleCrop = () => {
    if (toolType === ButtonTypes.crop) {
      dispatch(cropCancel());
      closeSubtool();
    } else {
      openSubtool(ButtonTypes.crop, methods.crop);
      dispatch(cropStart());
    }
  };

  const handleSign = () => {
    dispatchButtonData({ type: null });
    dispatch(cropCancel());
    if (isEdit === UP) setEdit(DOWN);
    setToolType(toolType === ButtonTypes.sign ? null : ButtonTypes.sign);

    const input = document.createElement('input');

    input.addEventListener('change', ({ target }) => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL((target as HTMLInputElement).files[0]);
      webglController.setSign(img);
    });

    input.type = 'file';
    input.click();
  };

  return (
    <StyledDiv>
      <VideoTool
        buttonData={getVideoToolsData(
          backwardVideo,
          playPauseVideo,
          forwardVideo,
          playing,
          hasEmptyVideo
        )}
      />
      <StyledEditToolDiv>
        {toolType && (
          <WrapperDiv isEdit={isEdit}>
            <SubEditTool buttonData={getSubEditToolsData(buttonData)} />
          </WrapperDiv>
        )}
        <EditTool
          buttonData={getEditToolData(
            handleRotateReverse,
            handleRatio,
            handleCrop,
            handleSign,
            hasEmptyVideo,
            toolType
          )}
        />
      </StyledEditToolDiv>
      <UploadArea />
    </StyledDiv>
  );
};

export default Tools;
