import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import webglController from '@/webgl/webglController';
import { loadSuccess } from '@/store/originalVideo/actions';
import { moveTo } from '@/store/currentVideo/actions';
import Slider from '@/components/atoms/Slider';
import HoverSlider from '@/components/atoms/HoverSlider';
import video from '@/video';
import CropLayer from '@/components/molecules/CropLayer';

const THUMNAIL_COUNT = 30;

const StyledDiv = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const StyledImg = styled.img`
  width: 3.3333%;
  height: 50px;
`;

interface ImageData {
  key: number;
  src: string;
}

const canvas = document.createElement('canvas');

const getImageAt = (secs: number) => {
  return new Promise(resolve => {
    video.addEventListener('seeked', () => {
      const context = canvas.getContext('2d');
      context.drawImage(video.getVideo(), 0, 0, canvas.width, canvas.height);

      resolve({ key: secs, src: canvas.toDataURL() });
    });
  });
};

export const getImages = async () => {
  // FIXME: refactor this later
  const thumbnail = await new Promise<any[]>(resolve => {
    video.addEventListener('loadedmetadata', async () => {
      const duration = video.getDuration();
      const gap = duration / (THUMNAIL_COUNT - 1);

      const images = [];
      let secs = 0;

      for (let count = 0; count < THUMNAIL_COUNT; count += 1) {
        video.setCurrentTime(secs);
        const image = await getImageAt(secs);

        secs += gap;
        images.push(image);
      }
      video.setCurrentTime(0);

      resolve(images);
    });
  });

  return thumbnail;
};

const Thumbnail: React.FC = () => {
  const [images, setImages] = useState([]);
  const [time, setTime] = useState(0);
  const [position, setPosition] = useState([0, 0]);

  const dispatch = useDispatch();

  const thumbnailRef = useRef<HTMLDivElement>(null);
  const hoverSliderRef = useRef<HTMLDivElement>(null);

  const getData = async (): Promise<void> => {
    const data = await getImages();

    webglController.main();

    dispatch(loadSuccess());
    setImages(data);
  };

  const handleClick = () => {
    video.setCurrentTime(time);

    dispatch(moveTo(time));
  };

  const handleMouseMove = (event: MouseEvent) => {
    const slider = hoverSliderRef.current;

    const mouseLocation = event.pageX;
    const offset = thumbnailRef.current.offsetLeft;

    const distance = mouseLocation - offset;

    const width = thumbnailRef.current.clientWidth;
    const duration = video.getDuration();

    const hoverTime = (distance / width) * duration;

    setTime(hoverTime);
    slider.style.left = `${distance}px`;
  };

  const handleMouseLeave = () => {
    hoverSliderRef.current.style.display = 'none';
  };

  const handleMouseEnter = () => {
    hoverSliderRef.current.style.display = 'block';
  };

  useEffect(() => {
    getData();
  });

  return (
    <StyledDiv
      ref={thumbnailRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <CropLayer positions={position} setPositions={setPosition} />
      <HoverSlider hoverSliderRef={hoverSliderRef} hoverTime={time} />
      <Slider thumbnailRef={thumbnailRef} />
      {images.map(({ key, src }: ImageData) => {
        return <StyledImg key={key} src={src} alt="" />;
      })}
    </StyledDiv>
  );
};

export default Thumbnail;
