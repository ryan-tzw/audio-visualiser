uniform float uAudioDataArrLastIndex;
uniform float uAudioDataArr[128];

varying vec2 vUv;

void applyVaryings() {
    vUv = uv;
}

void main() {
    // Constants
    float ARR_LAST_INDEX = uAudioDataArrLastIndex;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Calculate elevation
    float radius = distance(vec2(0.5), uv) * 2.0;
    int index = int(radius * ARR_LAST_INDEX);
    float strength = uAudioDataArr[index] / 255.0;

    modelPosition.y += strength * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    applyVaryings();
}
