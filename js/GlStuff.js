var webGLApp = function() {
    this.setup();
}
var mainCanvas;

webGLApp.prototype.setup = function() {
    // Global timer
    this.timer = {
        lastTime: 0
    }

    this.angle = 0;

    this.triangleVertexPositionBuffer = null;
    this.triangleVertexColorBuffer = null;
    this.basicShaderProgram = null;

    this.canvas = document.getElementById("MainCanvas");

    try {
        this.initGL(this.canvas);
    } catch (exception) {
        alert('Error while booting WebGL: ' + exception);
    }

    this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    
    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
    
}

webGLApp.prototype.initGL = function() {
    this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
    this.gl.viewportWidth = this.canvas.width;
    this.gl.viewportHeight = this.canvas.height;

    this.initBuffers();
    this.initShaders();

    if (!this.gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

webGLApp.prototype.initBuffers = function() {
    // Init matrices
    mvMatrix = mat4.create();
    pMatrix = mat4.create();
    
    // Init buffer objects
    this.triangleVertexPositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    var vertices = [
         0.0,  1.0, 0.0, 1.0,
        -0.87, -0.5, 0.0, 1.0,
         0.87, -0.5, 0.0, 1.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.triangleVertexPositionBuffer.itemSize = 4;
    this.triangleVertexPositionBuffer.numItems = 3;

    this.triangleVertexColorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    this.triangleVertexColorBuffer.itemSize = 4;
    this.triangleVertexColorBuffer.numItems = 3;
}

webGLApp.prototype.initShaders = function() {
    // Init shaders
    var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    this.gl.shaderSource(vertexShader, BasicVertexShader);
    this.gl.compileShader(vertexShader);
    if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
        alert(this.gl.getShaderInfoLog(vertexShader));
    }

    this.gl.shaderSource(fragmentShader, BasicFragmentShader);
    this.gl.compileShader(fragmentShader);
    if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
        alert(this.gl.getShaderInfoLog(fragmentShader));
    }

    this.basicShaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.basicShaderProgram, vertexShader);
    this.gl.attachShader(this.basicShaderProgram, fragmentShader);
    this.gl.linkProgram(this.basicShaderProgram);

    if (!this.gl.getProgramParameter(this.basicShaderProgram, this.gl.LINK_STATUS)) {
      throw "Could not initialise shaders";
    }

    this.gl.useProgram(this.basicShaderProgram);

    this.basicShaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.basicShaderProgram, "aVertexPosition");
    this.gl.enableVertexAttribArray(this.basicShaderProgram.vertexPositionAttribute);

    this.basicShaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.basicShaderProgram, "aVertexColor");
    this.gl.enableVertexAttribArray(this.basicShaderProgram.vertexColorAttribute);

    this.basicShaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.basicShaderProgram, "uPMatrix");
    this.basicShaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.basicShaderProgram, "uMVMatrix");
}

var lastSizeW = 0;
var lastSizeH = 0;

webGLApp.prototype.checkResize = function(canvas, projMatrix) {
    //if ((canvas.width !== lastSizeW) || (canvas.height !== lastSizeH))
    if ((document.body.clientWidth !== lastSizeW) || (document.body.clientHeight !== lastSizeH))
    {
        lastSizeH = document.body.clientHeight;
        lastSizeW = document.body.clientWidth;
        
        canvas.width = lastSizeW;
        canvas.height = lastSizeH;
        this.gl.viewport(0, 0, lastSizeW, lastSizeH);
        mat4.identity(projMatrix);
        mat4.perspective(projMatrix, 45, lastSizeW / lastSizeH, 0.1, 100.0);
    }
}

webGLApp.prototype.drawScene = function() {
    // You have to use an FBO!
	// AND
	// You have to provide vertex / fragment shaders

    this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.checkResize(this.canvas, pMatrix);
    
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -2.0]);
    mat4.rotate(mvMatrix, mvMatrix, (this.angle * 3.14159 / 180.0), [0, 0, 1]);

    this.gl.useProgram(this.basicShaderProgram);

    // Set GL matrices to those calculated
    this.gl.uniformMatrix4fv(this.basicShaderProgram.pMatrixUniform, false, pMatrix);
    this.gl.uniformMatrix4fv(this.basicShaderProgram.mvMatrixUniform, false, mvMatrix);

    // draw object
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    this.gl.vertexAttribPointer(this.basicShaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
    this.gl.vertexAttribPointer(this.basicShaderProgram.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
}

webGLApp.prototype.animate = function() {
    var timeNow = new Date().getTime();
    if (this.timer.lastTime != 0) {
        var elapsed = timeNow - this.timer.lastTime;

        // Update stuff based on timers
        this.angle += elapsed * 60.0 * 0.001;
    }
    this.timer.lastTime = timeNow;
}

webGLApp.prototype.tick = function(timestamp) {
    this.drawScene();
    this.animate();

    // bind .tick() with the appropriate execution context
    requestAnimationFrame(this.tick.bind(this));
}
