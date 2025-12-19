// uniform mat4 projectionMatrix; ////////clip space co-ordiates transformations
// uniform mat4 viewMatrix; ////relative to camera transformations
// uniform mat4 modelMatrix;  ////relative to mesh transformations
// attribute vec3 position;  ////vec3
attribute float aRandom;
uniform vec2 uFrequency;
// attribute vec2 uv;


uniform float uTime;
varying float vRandom; //// cant use attributes in fragment so we have to make a varying and assign attributes to it to use it in fragments
varying vec2 vuv ;
varying float vElevation;
void main()
{
    vec4 modelposition = modelMatrix * vec4(position , 1.0);
    float elevation = sin(modelposition.x * uFrequency.x-uTime) * 0.1;
    elevation += sin(modelposition.y * uFrequency.y-uTime)*0.1;
    modelposition.z += elevation;

    vec4 viewPosition = viewMatrix * modelposition;
    vec4 projectionPosition = projectionMatrix *viewPosition;

    gl_Position = projectionPosition; ////returns vec 4 -> position and W
    // gl_Position.x += 0.5;

    vElevation = elevation;
    vRandom = aRandom;
    vuv = uv;

}

// try not to use int data type and dont mix float with int