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
  sign: HTMLImageElement;

  rate: number = 1;

  rotate: boolean = false;

  flip: boolean = false;

  encode: boolean = false;

  constructor() {
    this.positions = this.init.positions.map(pair => [...pair]);
  }

  rotateLeft90Degree = () => {
    // 0123 => 1230
    if (this.flip) {
      this.positions.unshift(this.positions.pop());
    } else {
      this.positions.push(this.positions.shift());
    }

    this.rate *= this.rotate
      ? this.gl.canvas.width / this.gl.canvas.height
      : this.gl.canvas.height / this.gl.canvas.width;

    this.rotate = !this.rotate;

    this.buffers = initBuffers(this.gl, this.positions);
  };

  rotateRight90Degree = () => {
    // 0123 => 3012
    if (this.flip) {
      this.positions.push(this.positions.shift());
    } else {
      this.positions.unshift(this.positions.pop());
    }

    this.rate *= this.rotate
      ? this.gl.canvas.width / this.gl.canvas.height
      : this.gl.canvas.height / this.gl.canvas.width;
    this.rotate = !this.rotate;

    this.buffers = initBuffers(this.gl, this.positions);
  };

  reverseUpsideDown = () => {
    // 0123 => 3210
    this.flip = !this.flip;

    this.positions.forEach(element => {
      element[1] = -element[1];
    });

    this.buffers = initBuffers(this.gl, this.positions);
  };

  reverseSideToSide = () => {
    // 0123 => 1032
    this.flip = !this.flip;

    this.positions.forEach(element => {
      element[0] = -element[0];
    });

    this.buffers = initBuffers(this.gl, this.positions);
  };

  enlarge = () => {
    this.positions = this.positions.map(pair => pair.map(val => val * RATIO));
    this.buffers = initBuffers(this.gl, this.positions);
  };

  reduce = () => {
    this.positions = this.positions.map(pair => pair.map(val => val * INVERSE));
    this.buffers = initBuffers(this.gl, this.positions);
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

  setSign = sign => {
    this.sign = sign;
  };

  drawSign = (modelViewMatrix, projectionMatrix, programInfo) => {
    const reduce = 0.25;

    mat4.scale(modelViewMatrix, modelViewMatrix, [
      reduce,
      reduce * (this.sign.height / this.sign.width),
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
    this.glInit();
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
