// Global GL object
var gl;
var triangleVertexPositionBuffer;
var triangleVertexColorBuffer;
var basicShaderProgram;

function webGLStart() {
    var canvas = document.getElementById("WebGL-test0");
    initGL(canvas);
    
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Start looping
    tick();
}

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        
        // Init buffer objects
        triangleVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        var vertices = [
             0.0,  1.0, 0.0, 1.0,
            -0.87, -0.5, 0.0, 1.0,
             0.87, -0.5, 0.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        triangleVertexPositionBuffer.itemSize = 4;
        triangleVertexPositionBuffer.numItems = 3;

        triangleVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        var colors = [
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        triangleVertexColorBuffer.itemSize = 4;
        triangleVertexColorBuffer.numItems = 3;
        
        // Init shaders
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, BasicVertexShader);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(vertexShader));
        }

        gl.shaderSource(fragmentShader, BasicFragmentShader);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(fragmentShader));
        }

        basicShaderProgram = gl.createProgram();
        gl.attachShader(basicShaderProgram, vertexShader);
        gl.attachShader(basicShaderProgram, fragmentShader);
        gl.linkProgram(basicShaderProgram);

        if (!gl.getProgramParameter(basicShaderProgram, gl.LINK_STATUS)) {
          alert("Could not initialise shaders");
        }

        gl.useProgram(basicShaderProgram);

        basicShaderProgram.vertexPositionAttribute = gl.getAttribLocation(basicShaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(basicShaderProgram.vertexPositionAttribute);

        basicShaderProgram.vertexColorAttribute = gl.getAttribLocation(basicShaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(basicShaderProgram.vertexColorAttribute);

        basicShaderProgram.pMatrixUniform = gl.getUniformLocation(basicShaderProgram, "uPMatrix");
        basicShaderProgram.mvMatrixUniform = gl.getUniformLocation(basicShaderProgram, "uMVMatrix");
        
    } catch (e) {
        alert(e);
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function drawScene() {
    // You have to use an FBO!
	// AND
	// You have to provide vertex / fragment shaders
    
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();

    mat4.perspective(pMatrix, 60, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -1.0]);
    mat4.rotate(mvMatrix, mvMatrix, (angle * 3.14159 / 180.0), [0, 0, 1]);

    gl.useProgram(basicShaderProgram);

    // Set GL matrices to those calculated
    gl.uniformMatrix4fv(basicShaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(basicShaderProgram.mvMatrixUniform, false, mvMatrix);
    
    // draw object
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(basicShaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(basicShaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
}

// Global timer
var lastTime = 0;
var angle = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        
        // Update stuff based on timers
        angle += elapsed * 60.0 * 0.001;
    }
    lastTime = timeNow;
}


function tick(timestamp) {
    drawScene();
    animate();
    requestAnimationFrame(tick);
}
