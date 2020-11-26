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

class webglController {
  copyVideo: Boolean;

  positions: Array<number>;

  buffers: Buffers;

  gl: WebGLRenderingContext;

  pause: Boolean = false;

  constructor() {
    this.copyVideo = false;
    this.positions = [-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0];
  }

  rotateLeft90Degree = () => {
    this.positions.push(this.positions.shift());
    this.positions.push(this.positions.shift());
    this.buffers = this.initBuffers();
  };

  rotateRight90Degree = () => {
    this.positions.unshift(this.positions.pop());
    this.positions.unshift(this.positions.pop());
    this.buffers = this.initBuffers();
  };

  reverseUpsideDown = () => {
    const x1 = this.positions.shift();
    const y1 = this.positions.shift();

    const x2 = this.positions.shift();
    const y2 = this.positions.shift();

    const x3 = this.positions.shift();
    const y3 = this.positions.shift();
    this.positions.push(x3);
    this.positions.push(y3);

    this.positions.push(x2);
    this.positions.push(y2);

    this.positions.push(x1);
    this.positions.push(y1);

    this.buffers = this.initBuffers();
  };

  reverseSideToSide = () => {
    const x1 = this.positions.shift();
    const y1 = this.positions.shift();

    const x2 = this.positions.shift();
    const y2 = this.positions.shift();

    const x3 = this.positions.shift();
    const y3 = this.positions.shift();

    this.positions.push(x3);
    this.positions.push(y3);

    this.positions.unshift(y1);
    this.positions.unshift(x1);

    this.positions.unshift(y2);
    this.positions.unshift(x2);

    this.buffers = this.initBuffers();
  };

  enlarge = () => {
    const temp = [];

    this.positions.forEach(element => {
      if (element < 0) {
        temp.push(element - 1);
      } else {
        temp.push(element + 1);
      }
    });

    this.positions = temp;

    this.buffers = this.initBuffers();
  };

  reduce = () => {
    const temp = [];

    this.positions.forEach(element => {
      if (element < 0) {
        temp.push(element + 1);
      } else {
        temp.push(element - 1);
      }
    });

    this.positions = temp;

    this.buffers = this.initBuffers();
  };

  playPause = () => {
    this.pause = !this.pause;
  };

  initCanvas = (videoWidth: string, videoHeight: string) => {
    const canvas = document.getElementById('glcanvas') as HTMLCanvasElement;
    canvas.setAttribute('width', videoWidth);
    canvas.setAttribute('height', videoHeight);
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext;

    return gl;
  };

  initBuffers = () => {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.positions),
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
      video.getVideoWidth().toString(),
      video.getVideoHeight().toString()
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
      if (!video.getSrc()) return;

      this.updateTexture(texture);
      if (!this.pause) {
        video.play();
        this.drawScene(programInfo, texture);
      } else {
        video.pause();
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  };

  main = () => {
    video.addEventListener('loadeddata', () => {
      this.glInit();
    });
  };
}

export default webglController;
