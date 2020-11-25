import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { loadSuccess } from '@/store/originalVideo/actions';
import video from '@/video';
import customFilter from './webgl';

const THUMNAIL_COUNT = 30;

const StyledDiv = styled.div`
  display: flex;
  width: 90%;
`;

const StyledImg = styled.img`
  width: 3.3%;
  height: 50px;
`;

interface Props {
  URL: string;
  duration: number;
}

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

const getImages = async () => {
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

      resolve(images);
    });
  });

  return thumbnail;
};

const Thumbnail: React.FC<Props> = () => {
  const [images, setImages] = useState([]);

  const dispatch = useDispatch();

  const getData = async (): Promise<void> => {
    const data = await getImages();
    const canvas2 = document.createElement('canvas');
    const filteredImageURL = [];

    const promises = [];

    const startTime = new Date().getTime();

    data.forEach(element => {
      promises.push(
        customFilter(canvas2, element.src).then(res => {
          filteredImageURL.push(res);
        })
      );
    });

    Promise.all(promises).then(() => {
      const endTime = new Date().getTime();
      console.log(endTime - startTime);
      console.log(filteredImageURL);
      // 필터링 된 이미지 URL이고 여기서 dispath 또는 setImage 하면 됩니다.
    });

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
