precision mediump float; ////mandatory -> amount of presice highp = more performance load , laowp = worst result

varying float vRandom;
varying vec2 vuv;
varying float vElevation;
uniform sampler2D uTexture;  ////sampler 2D for loading textures

void main()
{
    vec4 textureColor = texture2D(uTexture, vuv);
    textureColor.rbg *= vElevation*2.0+0.5;
    gl_FragColor = textureColor; ////color the mesh RGBA = RBGAlpha

}