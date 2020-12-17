import React, {
  useState,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import styled, { keyframes } from 'styled-components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Effect, applyEffect } from '@/store/history/actions';
import Range from '@/components/atoms/Range';
import VolumeRange from '@/components/atoms/VolumeRange';
import ButtonGroup from '@/components/molecules/ButtonGroup';
import UploadArea from '@/components/molecules/UploadArea';
import EffectSlider from '@/components/molecules/EffectSliders';
import video from '@/video';
import { play, pause, moveTo, setAudio } from '@/store/currentVideo/actions';
import {
  getStartEnd,
  getPlaying,
  getVisible,
  getMessage,
  getIsCancel,
  getVolumeLevel,
} from '@/store/selectors';
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
const modalLayout = `
  top: 0vh;
  left: 0vw;
  width: 30vw;
  height: 20vh;
`;
const layoutStyle = `
  width: 30vw;
  height: 20vh;
  backgound-color: red;
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
  const [isSign, setIsSign] = useState(false);
  const message = useSelector(getMessage);
  const { start, end } = useSelector(getStartEnd, shallowEqual);
  const isCancel = useSelector(getIsCancel);

  const glCanvas = document.getElementById('glcanvas');
  const input = document.createElement('input');
  const [modalVisible, setModalVisible] = useState(false);
  const [volumeVisible, setVolumeVisible] = useState(false);
  const volumeLevel = useSelector(getVolumeLevel);

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

  const handleVolumeControllerClick = () => {
    const volume = volumeLevel ? 0 : 1;
    video.setVolume(volume);
    dispatch(setAudio(volume));
  };

  const handleVolumeControllerMouseEnter = () => {
    setVolumeVisible(true);
  };

  const handleVolumeControllerMouseLeave = ({ target }) => {
    if (target.tagName !== 'svg') {
      setVolumeVisible(false);
    }
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

    if (element.tagName !== 'INPUT' && message === '') {
      element.blur();
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
    }
  };

  let originX;
  let originY;

  const handleCanvasMouseMove = useCallback(e => {
    const diffX = e.x - originX;
    const diffY = originY - e.y;

    originX = e.x;
    originY = e.y;

    webglController.moveSign(diffX, diffY);
  }, []);

  const handleCanvasMouseDown = useCallback(e => {
    e.target.addEventListener('mousemove', handleCanvasMouseMove);
    originX = e.x;
    originY = e.y;
  }, []);

  const handleCanvasMouseUp = useCallback(e => {
    e.target.removeEventListener('mousemove', handleCanvasMouseMove);
  }, []);

  const handleInputChange = useCallback(({ target }) => {
    const file = (target as HTMLInputElement).files[0];
    const img = document.createElement('img');
    setIsSign(!!file);
    img.src = URL.createObjectURL(file);
    img.addEventListener('load', () => {
      webglController.setSign(img);
      webglController.setSignEdit(true);
    });
  }, []);
  const removeSignEvent = () => {
    const canvas = document.getElementById('glcanvas');
    canvas.removeEventListener('mousedown', handleCanvasMouseDown);
    canvas.removeEventListener('mousedown', handleCanvasMouseUp);
    input.removeEventListener('change', handleInputChange);
    input.value = null;
  };

  const closeSubtool = () => {
    removeSignEvent();
    setEdit(DOWN);
    setToolType(null);
    dispatchButtonData({ type: null });
  };
  const openSubtool = (type: ButtonTypes, payload: (() => void)[]) => {
    removeSignEvent();
    webglController.setSignEdit(false);
    if (type !== ButtonTypes.crop) dispatch(cropCancel());

    setEdit(UP);
    setToolType(type);
    dispatchButtonData({ type, payload });
  };

  const handleCropConfirm = useCallback(() => {
    dispatch(cropConfirm());
    closeSubtool();
  }, [dispatch]);
  const handleCropCancel = useCallback(() => {
    dispatch(cropCancel());
    closeSubtool();
  }, [dispatch]);

  const handleSignUpload = useCallback(() => {
    input.type = 'file';
    input.addEventListener('change', handleInputChange);
    input.click();
  }, []);

  const handleSignConfirm = useCallback(() => {
    webglController.setSignEdit(false);
    closeSubtool();
  }, []);

  const handleSignCancel = useCallback(() => {
    setIsSign(false);
    webglController.setSign(null);
    webglController.setSignEdit(false);
    closeSubtool();
  }, []);

  const methods = useMemo(
    () => ({
      rotateReverse: [
        () => dispatch(applyEffect(Effect.RotateCounterClockwise)),
        () => dispatch(applyEffect(Effect.RotateClockwise)),
        () => dispatch(applyEffect(Effect.FlipVertical)),
        () => dispatch(applyEffect(Effect.FlipHorizontal)),
      ],
      ratio: [
        () => dispatch(applyEffect(Effect.Enlarge)),
        () => dispatch(applyEffect(Effect.Reduce)),
        () => webglController.updateRatio(3 / 4), // FIXME: store 변경 필요
        () => webglController.updateRatio(9 / 16),
        () => webglController.restoreRatio(),
      ],
      crop: [handleCropConfirm, handleCropCancel],
      sign: [handleSignUpload, handleSignConfirm, handleSignCancel],
      filter: [],
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
    if (toolType !== ButtonTypes.sign) {
      if (isEdit === UP) setEdit(DOWN);
      openSubtool(ButtonTypes.sign, methods.sign);

      glCanvas.addEventListener('mousedown', handleCanvasMouseDown);
      glCanvas.addEventListener('mouseup', handleCanvasMouseUp);
      if (webglController.sign) webglController.setSignEdit(true);
    } else closeSubtool();
  };

  const handleFilter = () => {
    if (toolType !== ButtonTypes.filter) {
      if (isEdit === UP) setEdit(DOWN);
      openSubtool(ButtonTypes.filter, methods.filter);
    } else closeSubtool();
  };

  useEffect(() => {
    if (toolType !== null) {
      closeSubtool();
    }
  }, [isCancel]);

  return (
    <StyledDiv>
      <VideoTool
        buttonData={getVideoToolsData(
          backwardVideo,
          playPauseVideo,
          forwardVideo,
          handleVolumeControllerClick,
          handleVolumeControllerMouseEnter,
          handleVolumeControllerMouseLeave as () => void,
          volumeLevel,
          playing,
          hasEmptyVideo
        )}
      />
      {volumeVisible && <VolumeRange setVolumeVisible={setVolumeVisible} />}
      <StyledEditToolDiv>
        {toolType && (
          <WrapperDiv isEdit={isEdit}>
            <SubEditTool buttonData={getSubEditToolsData(buttonData)} />
            {toolType === ButtonTypes.sign && isSign && <Range />}
            {toolType === ButtonTypes.filter && <EffectSlider />}
          </WrapperDiv>
        )}
        <EditTool
          buttonData={getEditToolData(
            handleRotateReverse,
            handleRatio,
            handleCrop,
            handleSign,
            handleFilter,
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
