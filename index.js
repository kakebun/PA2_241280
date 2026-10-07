main();

function main() {
  /*========== 1. WebGL Context Setup ==========*/
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.log("WebGL unavailable");
    return;
  }

  // Включаем тест глубины
  gl.enable(gl.DEPTH_TEST);

  /*========== 2. Geometry Setup (Cube & Pyramid) ==========*/
  // Куб (-0.5 .. 0.5 по всем осям)
  const cubeVertices = new Float32Array([
    // Front face
    -0.5, -0.5,  0.5,  1, 0, 0, 1,
     0.5, -0.5,  0.5,  1, 0, 0, 1,
     0.5,  0.5,  0.5,  1, 0, 0, 1,
    -0.5, -0.5,  0.5,  1, 0, 0, 1,
     0.5,  0.5,  0.5,  1, 0, 0, 1,
    -0.5,  0.5,  0.5,  1, 0, 0, 1,
    // Back face
    -0.5, -0.5, -0.5,  0, 1, 0, 1,
    -0.5,  0.5, -0.5,  0, 1, 0, 1,
     0.5,  0.5, -0.5,  0, 1, 0, 1,
    -0.5, -0.5, -0.5,  0, 1, 0, 1,
     0.5,  0.5, -0.5,  0, 1, 0, 1,
     0.5, -0.5, -0.5,  0, 1, 0, 1,
    // Top face
    -0.5,  0.5, -0.5,  0, 0, 1, 1,
    -0.5,  0.5,  0.5,  0, 0, 1, 1,
     0.5,  0.5,  0.5,  0, 0, 1, 1,
    -0.5,  0.5, -0.5,  0, 0, 1, 1,
     0.5,  0.5,  0.5,  0, 0, 1, 1,
     0.5,  0.5, -0.5,  0, 0, 1, 1,
    // Bottom face
    -0.5, -0.5, -0.5,  1, 1, 0, 1,
     0.5, -0.5, -0.5,  1, 1, 0, 1,
     0.5, -0.5,  0.5,  1, 1, 0, 1,
    -0.5, -0.5, -0.5,  1, 1, 0, 1,
     0.5, -0.5,  0.5,  1, 1, 0, 1,
    -0.5, -0.5,  0.5,  1, 1, 0, 1,
    // Right face
     0.5, -0.5, -0.5,  1, 0, 1, 1,
     0.5,  0.5, -0.5,  1, 0, 1, 1,
     0.5,  0.5,  0.5,  1, 0, 1, 1,
     0.5, -0.5, -0.5,  1, 0, 1, 1,
     0.5,  0.5,  0.5,  1, 0, 1, 1,
     0.5, -0.5,  0.5,  1, 0, 1, 1,
    // Left face
    -0.5, -0.5, -0.5,  0, 1, 1, 1,
    -0.5, -0.5,  0.5,  0, 1, 1, 1,
    -0.5,  0.5,  0.5,  0, 1, 1, 1,
    -0.5, -0.5, -0.5,  0, 1, 1, 1,
    -0.5,  0.5,  0.5,  0, 1, 1, 1,
    -0.5,  0.5, -0.5,  0, 1, 1, 1,
  ]);

  // Квадратная пирамида (вариант 0), вписанная в блок 1x1x1
  const pyramidVertices = new Float32Array([
    // Base (2 triangles)
    -0.5, -0.5, -0.5,  0.8, 0.2, 0.2, 1,
     0.5, -0.5, -0.5,  0.8, 0.2, 0.2, 1,
     0.5, -0.5,  0.5,  0.8, 0.2, 0.2, 1,
    -0.5, -0.5, -0.5,  0.8, 0.2, 0.2, 1,
     0.5, -0.5,  0.5,  0.8, 0.2, 0.2, 1,
    -0.5, -0.5,  0.5,  0.8, 0.2, 0.2, 1,
    // Front side
    -0.5, -0.5,  0.5,  0.2, 0.8, 0.2, 1,
     0.5, -0.5,  0.5,  0.2, 0.8, 0.2, 1,
     0.0,  0.5,  0.0,  0.2, 0.8, 0.2, 1,
    // Right side
     0.5, -0.5,  0.5,  0.2, 0.2, 0.8, 1,
     0.5, -0.5, -0.5,  0.2, 0.2, 0.8, 1,
     0.0,  0.5,  0.0,  0.2, 0.2, 0.8, 1,
    // Back side
     0.5, -0.5, -0.5,  0.8, 0.8, 0.2, 1,
    -0.5, -0.5, -0.5,  0.8, 0.8, 0.2, 1,
     0.0,  0.5,  0.0,  0.8, 0.8, 0.2, 1,
    // Left side
    -0.5, -0.5, -0.5,  0.2, 0.8, 0.8, 1,
    -0.5, -0.5,  0.5,  0.2, 0.8, 0.8, 1,
     0.0,  0.5,  0.0,  0.2, 0.8, 0.8, 1,
  ]);

  const cubeVertexCount = cubeVertices.length / 7;
  const pyramidVertexCount = pyramidVertices.length / 7;

  // Объединенный буфер вершин
  const combinedVertices = new Float32Array(cubeVertices.length + pyramidVertices.length);
  combinedVertices.set(cubeVertices, 0);
  combinedVertices.set(pyramidVertices, cubeVertices.length);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, combinedVertices, gl.STATIC_DRAW);

  /*========== 3. Shaders Setup ==========*/
  const vsSource = `
    attribute vec4 aPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main() {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
      vColor = aVertexColor;
    }
  `;

  const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;

  const program = createProgram(gl, vsSource, fsSource);
  gl.useProgram(program);

  // Uniform locations
  const uModelMatrixLoc = gl.getUniformLocation(program, "uModelMatrix");
  const uViewMatrixLoc = gl.getUniformLocation(program, "uViewMatrix");
  const uProjMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

  // Attribute pointers setup (выполняется 1 раз)
  const FSIZE = Float32Array.BYTES_PER_ELEMENT;
  const aPositionLoc = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(aPositionLoc);
  gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, FSIZE * 7, 0);

  const aColorLoc = gl.getAttribLocation(program, "aVertexColor");
  gl.enableVertexAttribArray(aColorLoc);
  gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, false, FSIZE * 7, FSIZE * 3);

  /*========== 4. State & Controls ==========*/
  const state = {
    t: 0,
    paused: false,
    ortho: false,
    fovDeg: 60, // Вариант 1: initial FOV 60
    azimuth: 0,
  };

  function resize() {
    const displayWidth = Math.floor(canvas.clientWidth * window.devicePixelRatio);
    const displayHeight = Math.floor(canvas.clientHeight * window.devicePixelRatio);
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }
  window.addEventListener("resize", resize);
  resize();

  document.addEventListener("keydown", (event) => {
    const key = event.key.toUpperCase();
    if (key === "P") state.paused = !state.paused;
    if (key === "O") state.ortho = !state.ortho;
    if (key === "+" || key === "=") state.fovDeg = Math.min(100, state.fovDeg + 5);
    if (key === "-") state.fovDeg = Math.max(20, state.fovDeg - 5);
    if (event.key === "ArrowLeft") state.azimuth -= 5;
    if (event.key === "ArrowRight") state.azimuth += 5;
    if (key === "R") {
      state.t = 0;
      state.paused = false;
      state.ortho = false;
      state.fovDeg = 60;
      state.azimuth = 0;
    }
  });

  /*========== 5. Render Loop ==========*/
  let then = 0;
  let frameCount = 0;
  let lastFpsUpdate = 0;
  let currentFps = 0;

  function render(now) {
    now *= 0.001; // Перевод в секунды
    const dt = Math.min(now - then, 0.1); // Клампинг до 0.1 с
    then = now;

    if (!state.paused) {
      state.t += dt;
    }

    // Расчет FPS за последнюю секунду
    frameCount++;
    if (now - lastFpsUpdate >= 1.0) {
      currentFps = frameCount / (now - lastFpsUpdate);
      frameCount = 0;
      lastFpsUpdate = now;
    }

    gl.clearColor(0.07, 0.07, 0.07, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = canvas.clientWidth / canvas.clientHeight;

    // 1. Projection Matrix
    const projMatrix = mat4.create();
    if (state.ortho) {
      const halfH = 3.5;
      const halfW = halfH * aspect;
      mat4.ortho(projMatrix, -halfW, halfW, -halfH, halfH, 0.1, 100.0);
    } else {
      mat4.perspective(projMatrix, (state.fovDeg * Math.PI) / 180, aspect, 0.1, 100.0);
    }
    gl.uniformMatrix4fv(uProjMatrixLoc, false, projMatrix);

    // 2. View Matrix (Вариант 1: Eye [5, 3, 5])
    const viewMatrix = mat4.create();
    const baseEye = vec3.fromValues(5, 3, 5);
    const rad = (state.azimuth * Math.PI) / 180;
    
    // Поворот камеры вокруг оси Y (стрелки Влево/Вправо)
    const rotatedEye = vec3.create();
    vec3.rotateY(rotatedEye, baseEye, [0, 0, 0], rad);
    mat4.lookAt(viewMatrix, rotatedEye, [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv(uViewMatrixLoc, false, viewMatrix);

    // 3. Draw Cube
    const mCube = cubeModelMatrix(state.t);
    gl.uniformMatrix4fv(uModelMatrixLoc, false, mCube);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVertexCount);

    // 4. Draw Solid (Pyramid)
    const mSolid = solidModelMatrix(state.t);
    gl.uniformMatrix4fv(uModelMatrixLoc, false, mSolid);
    gl.drawArrays(gl.TRIANGLES, cubeVertexCount, pyramidVertexCount);

    // 5. Status Label Update
    const statusDiv = document.querySelector("#status");
    if (statusDiv) {
      statusDiv.textContent = `ID: 241280 | Proj: ${state.ortho ? "Ortho" : "Perspective"} | FOV: ${state.fovDeg}° | t: ${state.t.toFixed(1)}s | FPS: ${currentFps.toFixed(0)}`;
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/*========== Helper Transformation Functions ==========*/
function cubeModelMatrix(t) {
  const m = mat4.create();
  // Скорость 1.2 rad/s, ось (1, 1, 1)
  const axis = vec3.fromValues(1, 1, 1);
  vec3.normalize(axis, axis);
  mat4.rotate(m, m, 1.2 * t, axis);
  return m;
}

function solidModelMatrix(t) {
  const m = mat4.create();
  
  // 1. Наклон плоскости орбиты на 30 deg вокруг оси Z
  mat4.rotateZ(m, m, (30 * Math.PI) / 180);
  
  // 2. Поворот по орбите вокруг оси Y (Период T = 6s)
  const orbitAngle = (2 * Math.PI * t) / 6;
  mat4.rotateY(m, m, orbitAngle);
  
  // 3. Смещение на радиус орбиты (2.5 единицы)
  mat4.translate(m, m, [2.5, 0, 0]);
  
  // 4. Собственное вращение пирамиды вокруг оси Y (2.0 rad/s)
  mat4.rotateY(m, m, 2.0 * t);
  
  // 5. Пульсация размера s(t)
  const s = 0.65 + 0.15 * Math.sin((2 * Math.PI * t) / 3);
  mat4.scale(m, m, [s, s, s]);
  
  return m;
}

/*========== WebGL Helper Functions ==========*/
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}