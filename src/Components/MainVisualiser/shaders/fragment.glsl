uniform sampler2D uAudioDataTexture;

varying vec2 vUv;

// TODO: Make something that looks nicer
void main() {
    float texel = texture2D(uAudioDataTexture, vec2(vUv.x, 0.0)).r;

    gl_FragColor = vec4(vec3(texel), 1.0);
}