import loadEncoder from 'mp4-h264';
import webglController from '@/webgl/webglController';
import video from '.';

interface TrackReader {
  new (track: MediaStreamTrack): {
    start: Function;
    stop: Function;
  };
}

interface WebCodecs {
  VideoTrackReader: TrackReader;
}

const framerate = 30;
const interval = 1e6 / framerate;

interface VideoElement extends HTMLVideoElement {
  captureStream(): MediaStream;
}

const init = () => {
  const track: MediaStreamTrack = (video.getVideo() as VideoElement)
    .captureStream()
    .getVideoTracks()[0];
  track.applyConstraints({ advanced: [{ frameRate: framerate }] });

  const videoTrackReader = new ((window as unknown) as WebCodecs).VideoTrackReader(
    track
  );

  return videoTrackReader;
};

export default async (start, end) => {
  const videoTrackReader = init();

  const Encoder = await loadEncoder();

  const {
    drawingBufferWidth: width,
    drawingBufferHeight: height,
  } = webglController.getDrawingBufferWidthHeight();

  const encoder = Encoder.create({
    width,
    height,
    fps: 30,
  });

  let processedTimestamp = 0;

  const applyEffect = async (frame, timestamp) => {
    const image = await frame.createImageBitmap();
    const pixels = webglController.getPixelsFromImage(image);
    frame.destroy();
    do {
      encoder.encodeRGB(pixels);
      processedTimestamp += interval;
    } while (timestamp >= processedTimestamp + interval); // maintain fps
  };

  const duration = (end - start) * 1e6; // seconds -> microseconds
  const finished = frame => frame.timestamp >= duration;

  return new Promise(resolve => {
    const handleFrame = frame => {
      if (finished(frame)) {
        videoTrackReader.stop();
        video.pause();
        applyEffect(frame, duration).then(() => {
          const mp4 = encoder.end();
          resolve(new Blob([mp4], { type: 'video/mp4' }));
        });
      } else applyEffect(frame, frame.timestamp);
    };

    video.setCurrentTime(start);
    video.play();
    video.addEventListener('play', () => videoTrackReader.start(handleFrame), {
      once: true,
    });
  });
};
