import webglController from '@/webgl/webglController';
import video from '.';

const MAX_PENDING = 300;
const KEYFRAME_PERIOD = 150;
const INTERVAL = 250;

const framerate = 30;
const table = [
  {
    // https://en.wikipedia.org/wiki/VP9#Levels
    level: 11,
    bitrate: 0.8e6,
    size: 384 * 192,
  },
  {
    level: 20,
    bitrate: 1.8e6,
    size: 480 * 256,
  },
  {
    level: 21,
    bitrate: 3.6e6,
    size: 640 * 384,
  },
  {
    level: 30,
    bitrate: 7.2e6,
    size: 1080 * 512,
  },
  {
    level: 31,
    bitrate: 12e6,
    size: 1280 * 768,
  },
];

const best = {
  level: 40,
  bitrate: 18e6,
};

const getConfig = (width: number, height: number) => {
  const size = width * height;
  const fit = table.find(item => item.size <= size) || best;
  return {
    codec: `vp09.02.${fit.level}.12`, // profile.level.bitdepth
    width,
    height,
    bitrate: fit.bitrate,
    framerate,
  };
};

interface VideoElement extends HTMLVideoElement {
  captureStream(): MediaStream;
}

let pending: number = 0;
let frameCount: number = 0;
const isKeyFrame = () => frameCount % KEYFRAME_PERIOD === 0;

const init = () => {
  pending = 0;
  frameCount = 0;
  const chunks = [];
  const handleChunk = chunk => {
    pending -= 1;
    chunks.push(chunk);
  };

  const track = (video.getVideo() as VideoElement)
    .captureStream()
    .getVideoTracks()[0];
  track.applyConstraints({ advanced: [{ frameRate: framerate }] });

  const videoTrackReader = new VideoTrackReader(track);

  const videoEncoder = new VideoEncoder({
    output: handleChunk,
    error: e => console.log(e),
  });

  const width = video.get('videoWidth');
  const height = video.get('videoHeight');
  const encoderConfig = getConfig(width, height);
  videoEncoder.configure(encoderConfig);

  return {
    videoTrackReader,
    videoEncoder,
    encoderConfig,
    chunks,
  };
};

export default (start, end, file, name) => {
  const { videoTrackReader, videoEncoder, encoderConfig, chunks } = init();

  const duration = (end - start) * 1e6; // seconds -> microseconds
  const finished = frame => frame.timestamp > duration;

  const applyEffect = frame => {
    const { timestamp } = frame;
    frame.createImageBitmap().then(image => {
      frame.destroy();
      const editedImage = webglController.renderFromImageBitmap(image);
      videoEncoder.encode(new VideoFrame(editedImage, { timestamp }), {
        keyFrame: isKeyFrame(),
      });
    });
  };

  return new Promise(resolve => {
    let addEventListenerThenPlay;
    const handleFrame = frame => {
      if (finished(frame)) {
        videoTrackReader.stop();
        video.pause();
        videoEncoder.flush().then(() => {
          console.log(chunks);
          resolve({
            chunks,
            encoderConfig,
          });
        });
      } else if (pending >= MAX_PENDING) {
        videoTrackReader.stop();
        video.pause();
        const timer = setInterval(() => {
          if (pending < MAX_PENDING) {
            clearInterval(timer);
            applyEffect(frame);
            addEventListenerThenPlay();
          }
        }, INTERVAL);
      } else {
        frameCount += 1;
        pending += 1;
        applyEffect(frame);
      }
    };
    addEventListenerThenPlay = () => {
      video.play();
      video.addEventListener(
        'play',
        () => videoTrackReader.start(handleFrame),
        { once: true }
      );
    };

    video.setCurrentTime(start);
    addEventListenerThenPlay();
  });
};
