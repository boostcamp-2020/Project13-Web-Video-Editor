let baseTime: number;

const init = (iter, encoderConfig, ctx, clear) => {
  let decodeChunk;
  const handleFrame = frame => {
    const { timestamp } = frame;
    /* frame.createImageBitmap().then(image => {
      frame.destroy();
      const delay = performance.now() - baseTime - timestamp;
      setTimeout(
        () => {
          ctx.drawImage(image, 0, 0);
          const { value: chunk, done } = iter.next();
          if (done) clear();
          else decodeChunk(chunk);
        },
        delay < 0 ? 0 : delay
      );
    }); */
    const delay = performance.now() - baseTime - timestamp / 1000;
    // 3시 0분 0초 재생
    // 3시 0분 15초
    // timestamp: 10초
    setTimeout(
      () => {
        const { value: chunk, done } = iter.next();
        if (done) console.log(delay, frame);
        else decodeChunk(chunk);
      },
      delay < 0 ? 0 : delay
    );
  };
  const videoDecoder = new VideoDecoder({
    output: handleFrame,
    error: e => console.log(e),
  });
  decodeChunk = chunk => videoDecoder.decode(chunk);

  videoDecoder.configure({
    codec: encoderConfig.codec,
    codedWidth: encoderConfig.width,
    codedHeight: encoderConfig.height,
  });

  return { videoDecoder };
};

export default (chunks, encoderConfig, newDocument) => {
  const $canvas = document.createElement('canvas');
  $canvas.width = encoderConfig.width;
  $canvas.height = encoderConfig.height;
  const ctx = $canvas.getContext('2d', { alpha: false });
  const iter = chunks[Symbol.iterator]();
  const clear = () => ctx.clearRect(0, 0, $canvas.width, $canvas.height);

  const { videoDecoder } = init(iter, encoderConfig, ctx, clear);

  const $button = document.createElement('button');
  $button.innerText = 'Play';
  $button.onclick = () => {
    videoDecoder.decode(iter.next().value);
    baseTime = performance.now();
  };

  newDocument.body.appendChild($canvas);
  newDocument.body.appendChild($button);
  newDocument.close();
};
