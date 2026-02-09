import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import './GhostCursor.css';

type GhostCursorEnhancedProps = {
  className?: string;
  style?: React.CSSProperties;
  trailLength?: number;
  inertia?: number;
  grainIntensity?: number;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  brightness?: number;
  primaryColor?: string;
  secondaryColor?: string;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  edgeIntensity?: number;
  maxDevicePixelRatio?: number;
  targetPixels?: number;
  fadeDelayMs?: number;
  fadeDurationMs?: number;
  zIndex?: number;
  hoverIntensity?: number;
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float uGrainIntensity;
  uniform float uTime;
  uniform float uEdgeIntensity;
  uniform float uBrightness;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    
    // Grain
    if (uGrainIntensity > 0.0) {
      float grain = random(vUv + uTime) * uGrainIntensity;
      color.rgb += grain - uGrainIntensity * 0.5;
    }
    
    // Edge vignette
    if (uEdgeIntensity > 0.0) {
      vec2 center = vUv - 0.5;
      float dist = length(center);
      float vignette = smoothstep(0.5, 0.0, dist);
      color.rgb *= mix(1.0 - uEdgeIntensity, 1.0, vignette);
    }
    
    // Brightness
    color.rgb *= uBrightness;
    
    gl_FragColor = color;
  }
`;

export default function GhostCursorEnhanced({
  className,
  style,
  trailLength = 50,
  inertia = 0.5,
  grainIntensity = 0.05,
  bloomStrength = 0.1,
  bloomRadius = 1.0,
  bloomThreshold = 0.025,
  brightness = 1,
  primaryColor = '#0A0A0A',
  secondaryColor = '#a87441',
  mixBlendMode = 'screen',
  edgeIntensity = 0,
  maxDevicePixelRatio = 0.5,
  targetPixels,
  fadeDelayMs,
  fadeDurationMs,
  zIndex = 9999,
  hoverIntensity = 2.0,
}: GhostCursorEnhancedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const trailRef = useRef<{ x: number; y: number; age: number; intensity: number }[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const lastMoveRef = useRef(Date.now());
  const fadingRef = useRef(false);
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uGrainIntensity: { value: grainIntensity },
    uEdgeIntensity: { value: edgeIntensity },
    uBrightness: { value: brightness },
  });

  const dpr = useMemo(() => {
    const deviceDpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    return Math.min(deviceDpr, maxDevicePixelRatio);
  }, [maxDevicePixelRatio]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 1000);
    camera.position.z = 1;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Post-processing
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      bloomStrength,
      bloomRadius,
      bloomThreshold
    );

    const grainShader = new ShaderPass({
      uniforms: uniformsRef.current,
      vertexShader,
      fragmentShader,
    });

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(grainShader);
    composerRef.current = composer;

    // Trail geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(trailLength * 3);
    const colors = new Float32Array(trailLength * 3);
    const opacities = new Float32Array(trailLength);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    const material = new THREE.PointsMaterial({
      size: 20,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Color parsing
    const primary = new THREE.Color(primaryColor);
    const secondary = new THREE.Color(secondaryColor);

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.016;
      uniformsRef.current.uTime.value = time;

      // Check fade
      if (fadeDelayMs && fadeDurationMs) {
        const sinceLastMove = Date.now() - lastMoveRef.current;
        if (sinceLastMove > fadeDelayMs && !fadingRef.current) {
          fadingRef.current = true;
        }
        if (fadingRef.current) {
          const fadeProgress = Math.min((sinceLastMove - fadeDelayMs) / fadeDurationMs, 1);
          uniformsRef.current.uBrightness.value = brightness * (1 - fadeProgress);
          if (fadeProgress >= 1) {
            trailRef.current = [];
          }
        } else {
          uniformsRef.current.uBrightness.value = brightness;
        }
      }

      // Update mouse with inertia
      mouseRef.current.vx += (targetRef.current.x - mouseRef.current.x) * (1 - inertia);
      mouseRef.current.vy += (targetRef.current.y - mouseRef.current.y) * (1 - inertia);
      mouseRef.current.vx *= inertia;
      mouseRef.current.vy *= inertia;
      mouseRef.current.x += mouseRef.current.vx;
      mouseRef.current.y += mouseRef.current.vy;

      // Add to trail
      if (Math.abs(mouseRef.current.vx) > 0.1 || Math.abs(mouseRef.current.vy) > 0.1) {
        trailRef.current.push({
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          age: 0,
          intensity: Math.min(Math.sqrt(mouseRef.current.vx ** 2 + mouseRef.current.vy ** 2) * 0.1, 1),
        });
      }

      // Update trail
      trailRef.current = trailRef.current
        .map(p => ({ ...p, age: p.age + 1 }))
        .filter(p => p.age < trailLength);

      // Update geometry
      const posArray = geometry.attributes.position.array as Float32Array;
      const colArray = geometry.attributes.color.array as Float32Array;
      const opArray = geometry.attributes.opacity.array as Float32Array;

      for (let i = 0; i < trailLength; i++) {
        const point = trailRef.current[i];
        if (point) {
          posArray[i * 3] = point.x - width / 2;
          posArray[i * 3 + 1] = -(point.y - height / 2);
          posArray[i * 3 + 2] = 0;

          const life = 1 - point.age / trailLength;
          const color = primary.clone().lerp(secondary, point.intensity * hoverIntensity);
          colArray[i * 3] = color.r;
          colArray[i * 3 + 1] = color.g;
          colArray[i * 3 + 2] = color.b;
          opArray[i] = life;
        } else {
          posArray[i * 3 + 2] = -1000;
          opArray[i] = 0;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      geometry.attributes.opacity.needsUpdate = true;

      composer.render();
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      renderer.setSize(newWidth, newHeight);
      composer.setSize(newWidth, newHeight);
      camera.left = -newWidth / 2;
      camera.right = newWidth / 2;
      camera.top = newHeight / 2;
      camera.bottom = -newHeight / 2;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      lastMoveRef.current = Date.now();
      fadingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [dpr, trailLength, inertia, grainIntensity, bloomStrength, bloomRadius, bloomThreshold, brightness, primaryColor, secondaryColor, edgeIntensity, fadeDelayMs, fadeDurationMs, hoverIntensity]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex,
        mixBlendMode,
        ...style,
      }}
    />
  );
}
