import video from '@/video';
import vertexShaderSource from './vertexShaderSource';
import fragmentShaderSource from './fragmentShaderSource';

const initTexture = (gl: WebGLRenderingContext) => {
  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 0, 255]);

  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
};

const loadShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);

  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

const initShaderProgram = (gl: WebGLRenderingContext) => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = loadShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    return null;
  }

  return shaderProgram;
};

export const initBuffers = (
  gl: WebGLRenderingContext,
  positions: number[][],
  videoRotation: number
) => {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions.flat()),
    gl.STATIC_DRAW
  );

  const textureCoordinates = {
    0: [0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0],
    90: [1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0],
    180: [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0],
    270: [0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0],
  };

  const textureCoordBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates[videoRotation]),
    gl.STATIC_DRAW
  );

  const indices = [0, 1, 2, 0, 2, 3];
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
};

const initCanvas = (videoWidth: string, videoHeight: string) => {
  const canvas = document.getElementById('glcanvas') as HTMLCanvasElement;
  const factor = 1;

  canvas.setAttribute('width', (Number(videoWidth) / factor).toString());
  canvas.setAttribute('height', (Number(videoHeight) / factor).toString());

  const gl = (canvas.getContext('webgl', { alpha: false }) ||
    canvas.getContext('experimental-webgl', {
      alpha: false,
    })) as WebGLRenderingContext;

  return gl;
};

export const initConfig = (positions: number[][], videoRotation: number) => {
  const gl = initCanvas(
    video.get('videoWidth').toString(),
    video.get('videoHeight').toString()
  );

  const buffers = initBuffers(gl, positions, videoRotation);

  const shaderProgram = initShaderProgram(gl);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        'uProjectionMatrix'
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  const texture = initTexture(gl);

  return {
    gl,
    buffers,
    shaderProgram,
    programInfo,
    texture,
  };
};

export const clearCanvas = (gl: WebGLRenderingContext) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};
