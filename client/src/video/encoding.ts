import loadEncoder from 'mp4-h264';
import video from './video';

const framerate = 30;
const interval = 1 / framerate;

export default async (start, end, webglController) => {
  webglController.setCanvasResolution();
  const {
    drawingBufferWidth: width,
    drawingBufferHeight: height,
  } = webglController.getDrawingBufferWidthHeight();

  const Encoder = await loadEncoder();
  const encoder = Encoder.create({
    width,
    height,
    fps: 30,
  });

  let currentTime = start;
  video.pause();
  video.setCurrentTime(currentTime);

  return new Promise(resolve => {
    video.getVideo().onseeked = () => {
      if (currentTime > end) {
        video.getVideo().onseeked = null;
        const mp4 = encoder.end();
        resolve(new Blob([mp4], { type: 'video/mp4' }));
        return;
      }
      const pixels = webglController.getPixelsFromVideo();
      encoder.encodeRGB(pixels);
      video.setCurrentTime((currentTime += interval));
    };
  });
};
