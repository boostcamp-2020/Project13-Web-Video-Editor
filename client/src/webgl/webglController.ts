import { mat4 } from 'gl-matrix';

import vertexShaderSource from './vertexShaderSource';
import fragmentShaderSource from './fragmentShaderSource';

class webglControler {
  copyVideo: Boolean;

  positions: Array<number>;

  videoURL: string;

  buffers;

  gl;

  constructor(videoURL) {
    this.copyVideo = false;
    this.positions = [-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0];
    this.videoURL = videoURL;
  }

  rotateLeft90Degree = () => {
    this.positions.push(this.positions.shift());
    this.positions.push(this.positions.shift());
    this.buffers = this.initBuffers(this.gl);
  };

  rotateRight90Degree = () => {
    this.positions.unshift(this.positions.pop());
    this.positions.unshift(this.positions.pop());
    this.buffers = this.initBuffers(this.gl);
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

    this.buffers = this.initBuffers(this.gl);
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

    this.buffers = this.initBuffers(this.gl);
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

    this.buffers = this.initBuffers(this.gl);
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

    this.buffers = this.initBuffers(this.gl);
  };

  initCanvas = () => {
    const canvas = document.querySelector('#glcanvas') as HTMLCanvasElement;
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    return gl;
  };

  initBuffers = gl => {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.positions),
      gl.STATIC_DRAW
    );

    const normalBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    const vertexNormals = [
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
    ];

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexNormals),
      gl.STATIC_DRAW
    );

    const textureCoordBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0];

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      gl.STATIC_DRAW
    );

    const indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const indices = [0, 1, 2, 0, 2, 3];

    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    return {
      position: positionBuffer,
      normal: normalBuffer,
      textureCoord: textureCoordBuffer,
      indices: indexBuffer,
    };
  };

  setupVideo = () => {
    const video = document.createElement('video');

    video.muted = true;

    video.src = this.videoURL;
    video.addEventListener('timeupdate', () => {
      this.copyVideo = true;
    });

    video.addEventListener('loadeddata', () => {
      video.play();
    });

    return video;
  };

  loadShader = (gl, type, source) => {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  initShaderProgram = gl => {
    const vertexShader = this.loadShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.loadShader(
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

  initTexture = gl => {
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

  updateTexture = (gl, texture, video) => {
    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      video
    );
  };

  drawScene = (gl, programInfo, texture) => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.textureCoord);
      gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }

    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix
    );

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    {
      const vertexCount = 6;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  };

  main = () => {
    this.gl = this.initCanvas();
    this.buffers = this.initBuffers(this.gl);

    const video = this.setupVideo();
    const shaderProgram = this.initShaderProgram(this.gl);

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(
          shaderProgram,
          'aVertexPosition'
        ),
        vertexNormal: this.gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
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
        normalMatrix: this.gl.getUniformLocation(
          shaderProgram,
          'uNormalMatrix'
        ),
        uSampler: this.gl.getUniformLocation(shaderProgram, 'uSampler'),
      },
    };
    const texture = this.initTexture(this.gl);

    const render = () => {
      if (this.copyVideo) {
        this.updateTexture(this.gl, texture, video);
      }

      this.drawScene(this.gl, programInfo, texture);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  };
}

export default webglControler;
