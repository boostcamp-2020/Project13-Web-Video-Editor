import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const CROPPED_AUDIO = 'croppedAudio.mp3';
const ENCODED_VIDEO = 'encodedVideo.mp4';
const MUXED_VIDEO = 'muxedVideo.mp4';
const ORIGINAL_VIDEO = 'originalVideo';

const initFFmpeg = async () => {
  const ffmpeg = createFFmpeg({
    corePath: './node_modules/@ffmpeg/core/dist/ffmpeg-core.js',
    log: false,
  });

  await ffmpeg.load();

  return ffmpeg;
};

const getAudioFromOriginalVideo = async (
  ffmpeg,
  originalVideoFile: File,
  interval: { start: number; end: number }
): Promise<void> => {
  const originalVideo: Uint8Array = await fetchFile(originalVideoFile);

  ffmpeg.FS('writeFile', ORIGINAL_VIDEO, originalVideo);

  await ffmpeg.run(
    '-i',
    ORIGINAL_VIDEO,
    '-vn',
    '-ss',
    interval.start.toString(),
    '-to',
    interval.end.toString(),
    CROPPED_AUDIO
  );
};

const muxVideoAndAudio = async (
  encodedVideoBlob: Blob,
  originalVideoFile: File,
  fileName: string,
  interval: { start: number; end: number }
): Promise<File> => {
  const ffmpeg = await initFFmpeg();

  await getAudioFromOriginalVideo(ffmpeg, originalVideoFile, interval);

  const encodedVideo: Uint8Array = await fetchFile(encodedVideoBlob);
  ffmpeg.FS('writeFile', ENCODED_VIDEO, encodedVideo);

  await ffmpeg.run(
    '-i',
    CROPPED_AUDIO,
    '-i',
    ENCODED_VIDEO,
    '-c',
    'copy',
    MUXED_VIDEO
  );

  const muxedVideo: Uint8Array = ffmpeg.FS('readFile', MUXED_VIDEO);

  const muxedVideoFile = new File([muxedVideo], fileName, {
    type: 'video/mp4',
  });

  return muxedVideoFile;
};

export default muxVideoAndAudio;
