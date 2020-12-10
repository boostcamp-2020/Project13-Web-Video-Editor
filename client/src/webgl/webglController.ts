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

export const RATIO = 1.25;
export const INVERSE = 1 / RATIO;

const level = 0;
const stride = 0;
const offset = 0;
const numComponents = 2;
const vertexCount = 6;
const normalize = false;

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
  rate: number = 1;

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

  constructor() {
    this.positions = this.init.positions.map(pair => [...pair]);
  }

  rotateLeft90Degree = () => {
    this.phase += 1;

    this.rate *= this.rotate
      ? this.gl.canvas.width / this.gl.canvas.height
      : this.gl.canvas.height / this.gl.canvas.width;

    this.rotate = !this.rotate;
  };

  rotateRight90Degree = () => {
    this.phase -= 1;

    this.rate *= this.rotate
      ? this.gl.canvas.width / this.gl.canvas.height
      : this.gl.canvas.height / this.gl.canvas.width;
    this.rotate = !this.rotate;
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

  getPixelsFromImage = image => {
    this.encode = true;

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      level,
      this.internalFormat,
      this.srcFormat,
      this.srcType,
      image
    );

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

  encodeTexture = res => {
    return new Promise(resolve => {
      this.encode = true;

      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        level,
        this.internalFormat,
        this.srcFormat,
        this.srcType,
        res
      );

      this.drawScene(this.programInfo, this.texture);

      createImageBitmap(
        this.gl.canvas,
        0,
        0,
        this.gl.canvas.width,
        this.gl.canvas.height
      ).then(resultImage => {
        resolve(resultImage);
      });
    });
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
    if (this.flip) {
      mat4.scale(modelViewMatrix, modelViewMatrix, [1.0, -1.0, 1.0]);
    }

    mat4.rotate(
      modelViewMatrix,
      modelViewMatrix,
      ((-1 * this.phase * 90) / 180) * Math.PI,
      [0.0, 0.0, 1.0]
    );

    mat4.scale(modelViewMatrix, modelViewMatrix, [
      1 / (this.rate * this.rate),
      1.0,
      1.0,
    ]);

    mat4.scale(modelViewMatrix, modelViewMatrix, [
      1 / this.ratio,
      1 / this.ratio,
      1.0,
    ]);

    const canvas = this.gl.canvas as HTMLElement;

    mat4.translate(modelViewMatrix, modelViewMatrix, [
      this.signX / (canvas.clientWidth / 2),
      this.signY / (canvas.clientHeight / 2),
      0.0,
    ]);

    mat4.scale(modelViewMatrix, modelViewMatrix, [
      this.signRatio,
      this.signRatio *
        (this.gl.canvas.width / this.gl.canvas.height) *
        (this.sign.height / this.sign.width),
      1.0,
    ]);

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
    mat4.scale(modelViewMatrix, modelViewMatrix, [
      this.rate * this.rate,
      1.0,
      1.0,
    ]);

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
    const config = initConfig(this.positions);

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

    const render = () => {
      if (!video.get('src')) return;

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

  clear = () => {
    this.positions = this.init.positions.map(pair => [...pair]);
    this.buffers = initBuffers(this.gl, this.positions);
    this.rotate = false;
    this.flip = false;
    this.rate = 1;
  };

  reset = () => {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.clear();
  };
}
export default new WebglController();
