// Global GL object
var gl;

function webGLStart() {
    var canvas = document.getElementById("WebGL-test0");
    //initGL(canvas);
    //initShaders();
    //initBuffers();

    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
  }
