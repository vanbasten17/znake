/**
 * Custom Shaders for the "Premium Squared Neon" experience.
 * Includes:
 * - Bloom (Luminance-based glow)
 * - CRT Curvature (Pincushion distortion)
 * - Scanlines (Horizontal retro lines)
 * - Chromatic Aberration (Color fringing)
 */
import Phaser from 'phaser'

export const POST_FX_FRAG = `
#define SHADER_NAME PREMIUM_NEON_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform vec2 uResolution;
uniform float uBloomIntensity;
uniform float uCRTIntensity;
uniform float uChromaticAberration;
uniform float uSteps;
uniform float uInkIntensity;

varying vec2 outTexCoord;

// CRT Curvature logic
vec2 curve(vec2 uv) {
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / 3.0;
    uv = uv + uv * offset * offset * uCRTIntensity;
    uv = uv * 0.5 + 0.5;
    return uv;
}

void main() {
    vec2 uv = curve(outTexCoord);
    
    // Check if UV is out of bounds (for CRT edges)
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    // Chromatic Aberration
    float shift = uChromaticAberration * 0.003;
    vec4 col;
    col.r = texture2D(uMainSampler, vec2(uv.x + shift, uv.y)).r;
    col.g = texture2D(uMainSampler, uv).g;
    col.b = texture2D(uMainSampler, vec2(uv.x - shift, uv.y)).b;
    col.a = 1.0;

    // Simple Cell-Shaded Bloom (Posterized)
    float bloomThreshold = 0.52;
    vec2 texelSize = 1.0 / uResolution;
    vec3 bloom = vec3(0.0);
    
    bloom += max(texture2D(uMainSampler, uv + vec2(texelSize.x, 0.0)).rgb - bloomThreshold, 0.0);
    bloom += max(texture2D(uMainSampler, uv - vec2(texelSize.x, 0.0)).rgb - bloomThreshold, 0.0);
    bloom += max(texture2D(uMainSampler, uv + vec2(0.0, texelSize.y)).rgb - bloomThreshold, 0.0);
    bloom += max(texture2D(uMainSampler, uv - vec2(0.0, texelSize.y)).rgb - bloomThreshold, 0.0);
    
    // Posterize
    if (uSteps > 0.0) {
        bloom = floor(bloom * uSteps) / uSteps;
    }
    
    col.rgb += (bloom * 2.8 * uBloomIntensity);

    // Ink Outlining (Sobel-like edge detection)
    float depthShift = 1.2 * texelSize.x;
    float lum0 = texture2D(uMainSampler, uv).g;
    float lum1 = texture2D(uMainSampler, uv + vec2(depthShift, 0.0)).g;
    float lum2 = texture2D(uMainSampler, uv + vec2(0.0, depthShift)).g;
    float edge = abs(lum0 - lum1) + abs(lum0 - lum2);
    
    if (edge > 0.12) {
        col.rgb *= (1.0 - uInkIntensity * 0.85);
    }

    // Scanlines
    float scanline = sin(uv.y * uResolution.y * 1.8) * 0.04 * uCRTIntensity;
    col.rgb -= scanline;
    
    // Vignette
    float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    vignette = clamp(pow(16.0 * vignette, 0.05), 0.0, 1.0);
    col.rgb *= vignette;

    gl_FragColor = col;
}
`

export class ArcadeEffectsPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  private _bloom = 0.45
  private _crt = 0.4
  private _chromatic = 0
  private _steps = 4.0
  private _ink = 0.9

  constructor(game: Phaser.Game) {
    super({
      game,
      renderTarget: true,
      fragShader: POST_FX_FRAG,
    })
  }

  onPreRender(): void {
    const pipeline = this as any
    pipeline.set1f('uTime', this.game.loop.time)
    pipeline.set2f('uResolution', pipeline.renderer.width, pipeline.renderer.height)
    pipeline.set1f('uBloomIntensity', this._bloom)
    pipeline.set1f('uCRTIntensity', this._crt)
    pipeline.set1f('uChromaticAberration', this._chromatic)
    pipeline.set1f('uSteps', this._steps)
    pipeline.set1f('uInkIntensity', this._ink)
  }

  public setBloom(v: number): void {
    this._bloom = v
  }

  public setCRT(v: number): void {
    this._crt = v
  }

  public setChromatic(v: number): void {
    this._chromatic = v
  }
}
