uniform float uAudioDataArrLastIndex;
uniform float uAudioDataArr[128];

varying vec2 vUv;

void main() {
    float radius = distance(vec2(0.5), vUv) * 2.0;
    radius = min(radius, 1.0);
    int index = int(radius * uAudioDataArrLastIndex);
    float strength = uAudioDataArr[index] / 255.0;

    gl_FragColor = vec4(vec3(strength), strength);
}