/**
 * Animierter Warp-Shader als Hero-Hintergrund (Variante "Tiefsee").
 *
 * - Nutzt die gevendorte Vanilla-Library @paper-design/shaders (Apache-2.0),
 *   siehe js/vendor/. Es werden keine externen Requests ausgelöst.
 * - Progressive Enhancement: ohne WebGL2 bleibt der CSS-Gradient aus main.css
 *   als Hintergrund sichtbar, es passiert dann einfach nichts.
 * - Respektiert prefers-reduced-motion (Shader wird statisch gerendert).
 * - Pausiert, wenn der Hero nicht im Viewport ist oder der Tab im Hintergrund
 *   liegt, damit Akku/CPU geschont werden.
 */
import {
    ShaderMount,
    warpFragmentShader,
    WarpPatterns,
    ShaderFitOptions,
    getShaderColorFromString,
    getShaderNoiseTexture,
} from './vendor/paper-shaders-0.0.80.js';

// Parameter der Warp-Shaders. Farben leiten sich aus den CSS-Variablen in
// main.css ab (--background-dark, --primary-dark, --accent-blue) und sind
// bewusst abgedunkelt, damit Headline und Store-Badges lesbar bleiben.
const WARP_PARAMS = {
    colors: ['#0b1226', '#3c3c8c', '#0f172a', '#37227e'],
    proportion: 0.45,
    softness: 1,
    distortion: 0.25,
    swirl: 0.8,
    swirlIterations: 10,
    shapeScale: 0.1,
    shape: 'checks',
    scale: 1,
    rotation: 0,
    speed: 0.5,
};

function supportsWebGL2() {
    try {
        const canvas = document.createElement('canvas');
        return !!canvas.getContext('webgl2');
    } catch (_) {
        return false;
    }
}

async function mountHeroShader() {
    const host = document.querySelector('.hero-shader');
    if (!host || !supportsWebGL2()) return;

    const reduceMotion = window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Die Noise-Textur ist ein (eingebettetes) Bild und muss vollständig
    // geladen sein, bevor ShaderMount sie als Uniform übernimmt.
    const noiseTexture = getShaderNoiseTexture();
    if (!noiseTexture.complete) {
        try {
            await noiseTexture.decode();
        } catch (_) {
            return;
        }
    }

    const uniforms = {
        u_colors: WARP_PARAMS.colors.map(getShaderColorFromString),
        u_colorsCount: WARP_PARAMS.colors.length,
        u_proportion: WARP_PARAMS.proportion,
        u_softness: WARP_PARAMS.softness,
        u_distortion: WARP_PARAMS.distortion,
        u_swirl: WARP_PARAMS.swirl,
        u_swirlIterations: WARP_PARAMS.swirlIterations,
        u_shapeScale: WARP_PARAMS.shapeScale,
        u_shape: WarpPatterns[WARP_PARAMS.shape],
        u_noiseTexture: noiseTexture,
        // Sizing
        u_scale: WARP_PARAMS.scale,
        u_rotation: WARP_PARAMS.rotation,
        u_fit: ShaderFitOptions.none,
        u_offsetX: 0,
        u_offsetY: 0,
        u_originX: 0.5,
        u_originY: 0.5,
        u_worldWidth: 0,
        u_worldHeight: 0,
    };

    const speed = reduceMotion ? 0 : WARP_PARAMS.speed;
    // Fester Frame-Offset, damit auch ein statisches Bild (reduced motion)
    // eine schöne Stelle der Animation zeigt statt des Startzustands.
    const initialFrame = 268000;

    let mount;
    try {
        mount = new ShaderMount(
            host,
            warpFragmentShader,
            uniforms,
            { antialias: false, powerPreference: 'low-power' },
            speed,
            initialFrame,
            1,          // minPixelRatio – 1x reicht für einen weichen Hintergrund
            2560 * 1440 // maxPixelCount – begrenzt GPU-Last auf großen Displays
        );
    } catch (err) {
        // WebGL-Kontext konnte nicht erstellt werden – Fallback ist der CSS-Gradient.
        return;
    }

    host.classList.add('is-ready');

    if (reduceMotion) return;

    // Nur animieren, wenn der Hero sichtbar ist und der Tab aktiv ist.
    let inView = true;
    const syncSpeed = () => {
        mount.setSpeed(inView && !document.hidden ? WARP_PARAMS.speed : 0);
    };

    if ('IntersectionObserver' in window) {
        const hero = host.closest('.hero') || host;
        const observer = new IntersectionObserver((entries) => {
            inView = entries.some((entry) => entry.isIntersecting);
            syncSpeed();
        }, { threshold: 0 });
        observer.observe(hero);
    }

    document.addEventListener('visibilitychange', syncSpeed);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountHeroShader);
} else {
    mountHeroShader();
}
