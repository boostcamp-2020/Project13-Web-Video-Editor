const fragmentShaderSource = `
  precision mediump float;
  varying highp vec2 vTextureCoord;

  uniform sampler2D uSampler;
  uniform float chroma[3];

  uniform vec2 u_textureSize;
  uniform float u_kernel[9];
  uniform float u_kernelWeight;

  void main(void) {
    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;

    vec4 colorSum =
      texture2D(uSampler, vTextureCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
      texture2D(uSampler, vTextureCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
      texture2D(uSampler, vTextureCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
      texture2D(uSampler, vTextureCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
      texture2D(uSampler, vTextureCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
      texture2D(uSampler, vTextureCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
      texture2D(uSampler, vTextureCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
      texture2D(uSampler, vTextureCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
      texture2D(uSampler, vTextureCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
    
    vec4 weightColor = colorSum / u_kernelWeight;

    gl_FragColor.r = weightColor.r * chroma[0];
    gl_FragColor.g = weightColor.g * chroma[1];
    gl_FragColor.b = weightColor.b * chroma[2];
    gl_FragColor.a = weightColor.a;
  }
`;

export default fragmentShaderSource;
