import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { loadSuccess } from '@/store/originalVideo/actions';
import Slider from '@/components/atoms/Slider';
import video from '@/video';

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
      const gap = duration / THUMNAIL_COUNT;

      const images = [];

      for (let secs = 0; secs <= duration; Math.min((secs += gap), duration)) {
        video.setCurrentTime(secs);
        const image = await getImageAt(secs);

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

  const dispatch = useDispatch();

  const getData = async (): Promise<void> => {
    const data = await getImages();
    dispatch(loadSuccess());

    setImages(data);
  };

  useEffect(() => {
    getData();
  });

  return (
    <StyledDiv>
      {images.map(({ key, src }: ImageData) => {
        return <StyledImg key={key} src={src} alt="" />;
      })}
    </StyledDiv>
  );
};

export default Thumbnail;
