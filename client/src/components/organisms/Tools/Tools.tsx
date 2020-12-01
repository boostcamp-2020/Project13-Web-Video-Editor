import React, { useState, useReducer, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import webglController from '@/webgl/webglController';
import ButtonGroup from '@/components/molecules/ButtonGroup';
import UploadArea from '@/components/molecules/UploadArea';
import video from '@/video';
import { play, pause, moveTo } from '@/store/currentVideo/actions';
import { getStartEnd, getPlaying } from '@/store/selectors';
import { cropStart, cropCancel, cropConfirm } from '@/store/actionTypes';
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
  padding: 1rem;
`;

const slide = keyframes`
  from {
    transform: translate(0, 50px);
    opacity: 0;
  }
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
`;

const StyledEditToolDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EditTool = styled(ButtonGroup)`
  width: 20rem;
`;

const WrapperDiv = styled.div`
  width: 25rem;
  display: flex;
  justify-content: center;
  animation: ${slide} 0.5s -0.1s ease-out;
`;

const SubEditTool = styled(ButtonGroup)`
  width: 100%;
`;

const VideoTool = styled(ButtonGroup)``;

interface props {
  setEdit: Function;
}

const Tools: React.FC<props> = ({ setEdit }) => {
  const playing = useSelector(getPlaying);
  const dispatch = useDispatch();
  const [toolType, setToolType] = useState(null);
  const [buttonData, dispatchButtonData] = useReducer(reducer, initialData);

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
    (document.activeElement as HTMLButtonElement).blur();

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
        webglController.rotateLeft90Degree,
        webglController.rotateRight90Degree,
        webglController.reverseUpsideDown,
        webglController.reverseSideToSide,
      ],
      ratio: [webglController.enlarge, webglController.reduce],
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

  return (
    <StyledDiv>
      <VideoTool
        buttonData={getVideoToolsData(
          backwardVideo,
          playPauseVideo,
          forwardVideo,
          playing
        )}
      />
      <StyledEditToolDiv>
        {toolType && (
          <WrapperDiv>
            <SubEditTool buttonData={getSubEditToolsData(buttonData)} />
          </WrapperDiv>
        )}
        <EditTool
          buttonData={getEditToolData(
            handleRotateReverse,
            handleRatio,
            handleCrop
          )}
        />
      </StyledEditToolDiv>
      <UploadArea />
    </StyledDiv>
  );
};

export default Tools;
