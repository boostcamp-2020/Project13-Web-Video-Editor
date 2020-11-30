import { mat4 } from 'gl-matrix';

import video from '@/video';
import vertexShaderSource from './vertexShaderSource';
import fragmentShaderSource from './fragmentShaderSource';

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

const RATIO = 1.25;
const INVERSE = 1 / RATIO;

class WebglController {
  positions: number[][];

  buffers: Buffers;

  gl: WebGLRenderingContext;

  init = {
    positions: [
      [-1.0, -1.0],
      [1.0, -1.0],
      [1.0, 1.0],
      [-1.0, 1.0],
    ],
  };

  constructor() {
    this.positions = this.init.positions;
  }

  rotateLeft90Degree = () => {
    // 0123 => 1230
    this.positions.push(this.positions.shift());
    this.buffers = this.initBuffers();
  };

  rotateRight90Degree = () => {
    // 0123 => 3012
    this.positions.unshift(this.positions.pop());
    this.buffers = this.initBuffers();
  };

  reverseUpsideDown = () => {
    // 0123 => 3210
    this.positions.reverse();
    this.buffers = this.initBuffers();
  };

  reverseSideToSide = () => {
    // 0123 => 1032
    this.positions = [
      ...this.positions.slice(0, 2).reverse(),
      ...this.positions.slice(-2).reverse(),
    ];
    this.buffers = this.initBuffers();
  };

  enlarge = () => {
    this.positions = this.positions.map(pair => pair.map(val => val * RATIO));
    this.buffers = this.initBuffers();
  };

  reduce = () => {
    this.positions = this.positions.map(pair => pair.map(val => val * INVERSE));
    this.buffers = this.initBuffers();
  };

  initCanvas = (videoWidth: string, videoHeight: string) => {
    const canvas = document.getElementById('glcanvas') as HTMLCanvasElement;
    canvas.setAttribute('width', canvas.clientWidth.toString());
    canvas.setAttribute('height', canvas.clientHeight.toString());
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext;

    return gl;
  };

  initBuffers = () => {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.positions.flat()),
      this.gl.STATIC_DRAW
    );

    const textureCoordinates = [0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0];
    const textureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      this.gl.STATIC_DRAW
    );

    const indices = [0, 1, 2, 0, 2, 3];
    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    );

    return {
      position: positionBuffer,
      textureCoord: textureCoordBuffer,
      indices: indexBuffer,
    };
  };

  loadShader = (type: number, source: string) => {
    const shader = this.gl.createShader(type);

    this.gl.shaderSource(shader, source);

    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  initShaderProgram = () => {
    const vertexShader = this.loadShader(
      this.gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.loadShader(
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    const shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      return null;
    }

    return shaderProgram;
  };

  initTexture = () => {
    const texture = this.gl.createTexture();

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = this.gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = this.gl.RGBA;
    const srcType = this.gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 0, 255]);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
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

    return texture;
  };

  updateTexture = (texture: WebGLTexture) => {
    const level = 0;
    const internalFormat = this.gl.RGBA;
    const srcFormat = this.gl.RGBA;
    const srcType = this.gl.UNSIGNED_BYTE;
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      video.getVideo()
    );
  };

  drawScene = (programInfo: ProgramInfo, texture: WebGLTexture) => {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.ortho(projectionMatrix, -1.0, 1.0, -1.0, 1.0, zNear, zFar);

    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -1.0]);

    {
      const numComponents = 2;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
      this.gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      this.gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition
      );
    }

    {
      const numComponents = 2;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.textureCoord);
      this.gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      this.gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }

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

    {
      const vertexCount = 6;
      const type = this.gl.UNSIGNED_SHORT;
      const offset = 0;
      this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
    }
  };

  glInit = () => {
    this.gl = this.initCanvas(
      video.get('videoWidth').toString(),
      video.get('videoHeight').toString()
    );
    this.buffers = this.initBuffers();
    const shaderProgram = this.initShaderProgram();

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(
          shaderProgram,
          'aVertexPosition'
        ),
        textureCoord: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(
          shaderProgram,
          'uProjectionMatrix'
        ),
        modelViewMatrix: this.gl.getUniformLocation(
          shaderProgram,
          'uModelViewMatrix'
        ),
        uSampler: this.gl.getUniformLocation(shaderProgram, 'uSampler'),
      },
    };

    const texture = this.initTexture();

    const render = () => {
      if (!video.get('src')) return;

      this.updateTexture(texture);
      this.drawScene(programInfo, texture);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  };

  main = () => {
    this.glInit();
  };

  clear = () => {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  };
}
export default new WebglController();
