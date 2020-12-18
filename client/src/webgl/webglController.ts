import { mat4 } from 'gl-matrix';

import video from '@/video';
import { initConfig, initBuffers, clearCanvas } from './webglConfig';

interface Buffers {
  position: WebGLBuffer;
  textureCoord: WebGLBuffer;
  indices: WebGLBuffer;
}

interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
    textureCoord: number;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;
    uSampler: WebGLUniformLocation;
  };
}

interface Resolution {
  other: number;
  level: number;
}

export const RATIO = 1.25;
export const INVERSE = 1 / RATIO;

const level = 0;
const stride = 0;
const offset = 0;
const numComponents = 2;
const vertexCount = 6;
const normalize = false;
const FALSE = 0;

class WebglController {
  // gl config params
  gl: WebGLRenderingContext;

  buffers: Buffers;

  positions: number[][];

  shaderProgram: WebGLProgram;

  programInfo: ProgramInfo;

  texture: WebGLTexture;

  init = {
    positions: [
      [-1.0, -1.0],
      [1.0, -1.0],
      [1.0, 1.0],
      [-1.0, 1.0],
    ],
  };

  // option params
  internalFormat: number;

  srcFormat: number;

  srcType: number;

  type: number;

  typeShort: number;

  // edit params
  rotate: boolean = false;

  phase: number = 0;

  ratio: number = 1;

  flip: boolean = false;

  encode: boolean = false;

  // sign params
  sign: HTMLImageElement;

  signX: number = 0;

  signY: number = 0;

  signRatio: number = 0.25;

  signEdit: boolean = false;

  signGrid: HTMLImageElement = new Image();

  // filter params
  chroma: number[] = [1.0, 1.0, 1.0];

  blurRatio: number = 0;

  grayScale: number = FALSE;

  luminance: number = 0.0;

  // video params
  videoRotation: number = 0;

  originalRatio: number;

  originalWidth: number;

  originalHeight: number;

  resolution: Resolution;

  constructor() {
    this.positions = this.init.positions.map(pair => [...pair]);
  }

  swapWidthHeight = () => {
    const relX = this.signX / (this.gl.canvas as HTMLElement).clientWidth;
    const relY = this.signY / (this.gl.canvas as HTMLElement).clientHeight;

    const { width } = this.gl.canvas;
    this.gl.canvas.width = this.gl.canvas.height;
    this.gl.canvas.height = width;

    this.signX = (this.gl.canvas as HTMLElement).clientWidth * relX;
    this.signY = (this.gl.canvas as HTMLElement).clientHeight * relY;
  };

  rotateLeft90Degree = () => {
    this.phase += this.flip ? -1 : 1;
    this.swapWidthHeight();
  };

  rotateRight90Degree = () => {
    this.phase += this.flip ? 1 : -1;
    this.swapWidthHeight();
  };

  reverseUpsideDown = () => {
    this.flip = !this.flip;
  };

  reverseSideToSide = () => {
    this.flip = !this.flip;
    this.phase += 2;
  };

  enlarge = () => {
    this.ratio *= RATIO;
  };

  reduce = () => {
    this.ratio *= INVERSE;
  };

  getDrawingBufferWidthHeight = () => {
    return {
      drawingBufferWidth: this.gl.drawingBufferWidth,
      drawingBufferHeight: this.gl.drawingBufferHeight,
    };
  };

  getPixelsFromVideo = () => {
    this.encode = true;
    this.updateTexture(this.texture);
    this.drawScene(this.programInfo, this.texture);
    const pixels = new Uint8Array(
      this.gl.drawingBufferWidth * this.gl.drawingBufferHeight * 4
    );
    this.gl.readPixels(
      0,
      0,
      this.gl.drawingBufferWidth,
      this.gl.drawingBufferHeight,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      pixels
    );
    return pixels;
  };

  setChromaRed = chroma => {
    this.chroma[0] = chroma;
  };

  setChromaGreen = chroma => {
    this.chroma[1] = chroma;
  };

  setChromaBlue = chroma => {
    this.chroma[2] = chroma;
  };

  setBlur = blurRatio => {
    this.blurRatio = blurRatio;
  };

  moveSign = (diffX: number, diffY: number) => {
    this.signX += diffX;
    this.signY += diffY;
  };

  setSignRatio = signRatio => {
    this.signRatio = signRatio / 100;
  };

  setSignEdit = signEdit => {
    this.signEdit = signEdit;
  };

  setSign = sign => {
    this.sign = sign;
  };

  setGrayScale = grayScale => {
    this.grayScale = grayScale;
  };

  setLuminance = luminance => {
    this.luminance = luminance;
  };

  setVideoRotation = videoRotation => {
    this.videoRotation = videoRotation;
  };

  setResolution = resolution => {
    this.resolution = resolution;
  };

  setCanvasResolution = () => {
    if (this.gl.canvas.width > this.gl.canvas.height) {
      this.gl.canvas.width = this.resolution.other;
      this.gl.canvas.height = this.resolution.level;
    } else {
      this.gl.canvas.height = this.resolution.other;
      this.gl.canvas.width = this.resolution.level;
    }
  };

  updateTexture = (texture: WebGLTexture) => {
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      level,
      this.internalFormat,
      this.srcFormat,
      this.srcType,
      video.getVideo()
    );
  };

  drawGrid = (modelViewMatrix, projectionMatrix, programInfo) => {
    this.gl.useProgram(programInfo.program);

    this.gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    this.gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );

    const texture = this.gl.createTexture();

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      level,
      this.internalFormat,
      this.srcFormat,
      this.srcType,
      this.signGrid
    );

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR
    );

    this.gl.drawElements(
      this.gl.TRIANGLES,
      vertexCount,
      this.typeShort,
      offset
    );
  };

  drawSign = (modelViewMatrix, projectionMatrix, programInfo) => {
    mat4.rotate(
      modelViewMatrix,
      modelViewMatrix,
      ((-1 * this.phase * 90) / 180) * Math.PI,
      [0.0, 0.0, 1.0]
    );

    let scaleX = 1 / this.ratio;
    let scaleY = this.flip ? -scaleX : scaleX;
    mat4.scale(modelViewMatrix, modelViewMatrix, [scaleX, scaleY, 1]);

    const { clientWidth, clientHeight } = this.gl.canvas as HTMLElement;

    mat4.translate(modelViewMatrix, modelViewMatrix, [
      this.signX / (clientWidth / 2),
      this.signY / (clientHeight / 2),
      0.0,
    ]);

    scaleX = this.signRatio;
    scaleY =
      this.signRatio *
      (this.gl.canvas.width / this.gl.canvas.height) *
      (this.sign.height / this.sign.width);

    mat4.scale(modelViewMatrix, modelViewMatrix, [scaleX, scaleY, 1.0]);

    this.gl.useProgram(programInfo.program);

    this.gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    this.gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );

    const texture = this.gl.createTexture();

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      level,
      this.internalFormat,
      this.srcFormat,
      this.srcType,
      this.sign
    );

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR
    );

    const grayScaleFlag = this.gl.getUniformLocation(
      this.programInfo.program,
      'grayScaleFlag'
    );

    this.gl.uniform1i(grayScaleFlag, FALSE);

    const chromaRedLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'chroma[0]'
    );
    const chromaBlueLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'chroma[1]'
    );

    const chromaGreenLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'chroma[2]'
    );

    this.gl.uniform1f(chromaRedLocation, 1.0);

    this.gl.uniform1f(chromaBlueLocation, 1.0);

    this.gl.uniform1f(chromaGreenLocation, 1.0);

    const luminanceLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'luminance'
    );

    this.gl.uniform1f(luminanceLocation, 0.0);

    const edgeDetectKernel = [0, 0, 0, 0, 1, 0, 0, 0, 0];

    const kernelLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'u_kernel[0]'
    );

    this.gl.uniform1fv(kernelLocation, edgeDetectKernel);

    const kernelWeightLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'u_kernelWeight'
    );

    this.gl.uniform1f(kernelWeightLocation, 1);

    this.gl.drawElements(
      this.gl.TRIANGLES,
      vertexCount,
      this.typeShort,
      offset
    );
  };

  drawScene = (programInfo: ProgramInfo, texture: WebGLTexture) => {
    clearCanvas(this.gl);

    const zNear = 0.1;
    const zFar = 1.0;
    const projectionMatrix = mat4.create();

    mat4.ortho(projectionMatrix, -1.0, 1.0, -1.0, 1.0, zNear, zFar);

    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -0.5]);

    const scaleX = this.ratio;
    const scaleY = this.flip ? -this.ratio : this.ratio;
    mat4.scale(modelViewMatrix, modelViewMatrix, [scaleX, scaleY, 1]);

    mat4.rotate(
      modelViewMatrix,
      modelViewMatrix,
      ((this.phase * 90) / 180) * Math.PI,
      [0.0, 0.0, 1.0]
    );

    if (this.phase % 2 === 0 && this.encode) {
      mat4.scale(modelViewMatrix, modelViewMatrix, [1.0, -1.0, 1.0]);
    } else if (this.encode) {
      mat4.scale(modelViewMatrix, modelViewMatrix, [-1.0, 1.0, 1.0]);
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      this.type,
      normalize,
      stride,
      offset
    );
    this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.textureCoord);
    this.gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      numComponents,
      this.type,
      normalize,
      stride,
      offset
    );
    this.gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

    this.gl.useProgram(programInfo.program);

    this.gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    this.gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );

    this.gl.activeTexture(this.gl.TEXTURE0);

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    const textureSizeLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'u_textureSize'
    );

    const canvas = this.gl.canvas as HTMLCanvasElement;

    this.gl.uniform2f(
      textureSizeLocation,
      canvas.clientWidth,
      canvas.clientHeight
    );

    const grayScaleFlag = this.gl.getUniformLocation(
      this.programInfo.program,
      'grayScaleFlag'
    );

    this.gl.uniform1i(grayScaleFlag, this.grayScale);

    const chromaRedLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'chroma[0]'
    );
    const chromaBlueLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'chroma[1]'
    );

    const chromaGreenLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'chroma[2]'
    );

    this.gl.uniform1f(chromaRedLocation, this.chroma[0]);

    this.gl.uniform1f(chromaBlueLocation, this.chroma[1]);

    this.gl.uniform1f(chromaGreenLocation, this.chroma[2]);

    const luminanceLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'luminance'
    );

    this.gl.uniform1f(luminanceLocation, this.luminance);

    const edgeDetectKernel = Array.from({ length: 8 }, () => this.blurRatio);

    edgeDetectKernel.splice(4, 0, 1);

    const kernelLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'u_kernel[0]'
    );

    this.gl.uniform1fv(kernelLocation, edgeDetectKernel);

    const kernelWeightLocation = this.gl.getUniformLocation(
      this.programInfo.program,
      'u_kernelWeight'
    );

    const tempWeight = edgeDetectKernel.reduce((prev, curr) => {
      return prev + curr;
    });

    const weight = tempWeight <= 0 ? 1 : tempWeight;

    this.gl.uniform1f(kernelWeightLocation, weight);

    this.gl.drawElements(
      this.gl.TRIANGLES,
      vertexCount,
      this.typeShort,
      offset
    );

    if (this.sign) {
      this.drawSign(modelViewMatrix, projectionMatrix, programInfo);
    }

    if (this.signEdit) {
      this.drawGrid(modelViewMatrix, projectionMatrix, programInfo);
    }
  };

  glInit = () => {
    const config = initConfig(this.positions, this.videoRotation);

    this.gl = config.gl;
    this.buffers = config.buffers;
    this.shaderProgram = config.shaderProgram;
    this.programInfo = config.programInfo;
    this.texture = config.texture;

    this.internalFormat = this.gl.RGBA;
    this.srcFormat = this.gl.RGBA;
    this.srcType = this.gl.UNSIGNED_BYTE;
    this.type = this.gl.FLOAT;
    this.typeShort = this.gl.UNSIGNED_SHORT;
    this.originalRatio = video.get('videoWidth') / video.get('videoHeight');
    this.originalWidth = video.get('videoWidth');
    this.originalHeight = video.get('videoHeight');

    const render = () => {
      if (!video.get('src') || this.encode) return;

      this.updateTexture(this.texture);
      this.drawScene(this.programInfo, this.texture);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  };

  main = () => {
    const gridImg =
      'data:image/png;base64,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';

    this.glInit();
    this.signGrid.src = gridImg;
  };

  initProps = () => {
    this.flip = false;
    this.encode = false;
    this.sign = null;
    this.phase = 0;
    this.ratio = 1;
    this.restoreRatio();
  };

  initEffectProps = () => {
    this.luminance = 0.0;
    this.chroma = [1.0, 1.0, 1.0];
    this.blurRatio = 0;
    this.grayScale = FALSE;
  };

  clear = () => {
    this.positions = this.init.positions.map(pair => [...pair]);
    this.buffers = initBuffers(this.gl, this.positions, this.videoRotation);
    this.initProps();
    this.initEffectProps();
  };

  reset = () => {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.clear();
  };

  updateRatio = (ratio: number) => {
    const currentResolution = this.gl.canvas.width * this.gl.canvas.height;
    const y = Math.sqrt(ratio * currentResolution);
    const x = currentResolution / y;

    this.gl.canvas.width = Math.round(x >> 1) << 1;
    this.gl.canvas.height = Math.round(y >> 1) << 1;
  };

  restoreRatio = () => {
    this.gl.canvas.width = this.originalWidth;
    this.gl.canvas.height = this.originalHeight;
  };
}
export default new WebglController();
