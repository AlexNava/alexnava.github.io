// Global GL object
var gl;

function webGLStart() {
    var canvas = document.getElementById("WebGL-test0");
    initGL(canvas);
    
    //initShaders();
    //initBuffers();

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
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0, 0, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();

    mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -7.0]);
    mat4.rotate(mvMatrix, mvMatrix, (angle * 3.14159 / 180.0), [0, 0, 1]);

    // Set GL matrices to those calculated
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    
    // draw object
    var vertices = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];

	// You have to use an FBO!
	// AND
	// You have to provide vertex / fragment shaders
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
