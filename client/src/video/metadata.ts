import MediaInfo from 'mediainfo.js';

const readMetaData = async (videoFile: File) => {
  const scriptDirectory = `${window.location.href}node_modules/mediainfo.js/dist/MediaInfoModule.wasm`;

  const mediainfo = await MediaInfo({
    locateFile: () => scriptDirectory,
  });

  const getSize = () => videoFile.size;

  const readChunk = (chunkSize, offset) =>
    new Promise<Uint8Array>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = ({ target: { error, result } }) => {
        if (error) reject(error);
        resolve(new Uint8Array(result as ArrayBuffer));
      };

      reader.readAsArrayBuffer(videoFile.slice(offset, offset + chunkSize));
    });

  const metadata = await mediainfo.analyzeData(getSize, readChunk);
  return metadata;
};

export default readMetaData;
