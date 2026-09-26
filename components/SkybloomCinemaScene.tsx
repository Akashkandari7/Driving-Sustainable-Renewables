"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface CinemaSceneProps {
  scrollProgress: number; // 0 to 1
}

export default function SkybloomCinemaScene({ scrollProgress }: CinemaSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  // Keep targetProgress updated from props
  useEffect(() => {
    targetProgress.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060c17, 0.032);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3, 14);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x060c17, 1);
    container.appendChild(renderer.domElement);

    // 3. LIGHTING
    const ambientLight = new THREE.AmbientLight(0x1e3a5f, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 3.2); // Warm sun
    sunLight.position.set(15, 12, -20);
    scene.add(sunLight);

    const greenFill = new THREE.PointLight(0x10b981, 2.5, 30);
    greenFill.position.set(-6, 4, 0);
    scene.add(greenFill);

    const blueFill = new THREE.PointLight(0x0284c7, 2.5, 30);
    blueFill.position.set(6, 3, -8);
    scene.add(blueFill);

    // 4. PROCEDURAL ENVIRONMENT

    // A. Ground Landscape
    const groundGeo = new THREE.PlaneGeometry(120, 120, 40, 40);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Gentle undulating terrain
      const z = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 1.2;
      pos.setZ(i, z);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x091424,
      roughness: 0.85,
      metalness: 0.15,
      wireframe: false,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.2;
    scene.add(ground);

    // B. Distant Horizon Mountain Silhouettes
    const mountainGeo = new THREE.ConeGeometry(18, 12, 5);
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x040810,
      roughness: 0.95,
      fog: true,
    });
    for (let i = 0; i < 7; i++) {
      const m = new THREE.Mesh(mountainGeo, mountainMat);
      m.position.set(-35 + i * 12, 2.5, -45 - (i % 3) * 6);
      m.scale.set(1 + (i % 2) * 0.4, 1 + (i % 3) * 0.3, 1);
      scene.add(m);
    }

    // C. Glowing Distant Sun Sphere
    const sunGeo = new THREE.SphereGeometry(4.5, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      fog: false,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.copy(sunLight.position);
    scene.add(sunMesh);

    // D. Solar PV Array (Field of high-tech solar panels)
    const solarGroup = new THREE.Group();
    const panelGeo = new THREE.BoxGeometry(2.4, 0.08, 1.4);

    // Solar Glass Material with subtle iridescent reflection
    const panelGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x021a36,
      roughness: 0.08,
      metalness: 0.92,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.85,
      roughness: 0.3,
    });

    // Sub-grid lines on panel
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 6; c++) {
        const panel = new THREE.Mesh(panelGeo, panelGlassMat);
        panel.position.set(-8 + c * 2.8, 0, -4 - r * 2.5);
        panel.rotation.x = -0.32; // Tilted towards the sun

        // Panel mounting post
        const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
        const post = new THREE.Mesh(postGeo, frameMat);
        post.position.set(0, -0.6, 0);
        panel.add(post);

        solarGroup.add(panel);
      }
    }
    scene.add(solarGroup);

    // E. 3D BESS Storage Container (Industrial battery unit with glowing LED indicators)
    const bessGroup = new THREE.Group();
    bessGroup.position.set(6.5, 0.4, -2.5);
    bessGroup.rotation.y = -0.45;

    // Main Container Body
    const containerGeo = new THREE.BoxGeometry(3.6, 2.4, 2.2);
    const containerMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.35,
      metalness: 0.5,
    });
    const containerMesh = new THREE.Mesh(containerGeo, containerMat);
    bessGroup.add(containerMesh);

    // Roof & Base Trim
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const roofTrim = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.12, 2.3), trimMat);
    roofTrim.position.y = 1.22;
    bessGroup.add(roofTrim);

    const baseTrim = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.18, 2.3), trimMat);
    baseTrim.position.y = -1.22;
    bessGroup.add(baseTrim);

    // Glowing LED Status Bar (DSR Bio-Emerald)
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.06, 0.04), ledMat);
    ledStrip.position.set(0, 0.85, 1.12);
    bessGroup.add(ledStrip);

    // Vent & Door Grooves
    const ventMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    for (let v = 0; v < 4; v++) {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.02), ventMat);
      vent.position.set(-0.8 + (v % 2) * 1.6, -0.2 - Math.floor(v / 2) * 0.2, 1.11);
      bessGroup.add(vent);
    }

    scene.add(bessGroup);

    // F. Bio-Photons & Clean Energy Spores (Atmospheric floating particles)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 1] = Math.random() * 12;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: 0.008 + Math.random() * 0.015, // float gently upward like warm air
        z: (Math.random() - 0.5) * 0.015,
      });
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      color: 0x34d399,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // G. Flowing Cyan/Emerald Energy Stream (Light trajectory through the field)
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-14, 0.2, 6),
      new THREE.Vector3(-6, 0.8, 2),
      new THREE.Vector3(0, 1.4, -2),
      new THREE.Vector3(5, 1.2, -3),
      new THREE.Vector3(12, 2.5, -12),
      new THREE.Vector3(20, 6.0, -25),
    ]);

    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.04, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const energyTube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(energyTube);

    // 5. CAMERA WAYPOINT TRAJECTORY (Driven 100% by scroll)
    // As user scrolls from 0 to 1, camera travels along this cinematic curve!
    const cameraWaypoints = [
      // 0.0 - Hero: Wide establishing shot over solar farm towards the horizon
      { pos: new THREE.Vector3(0, 3.2, 12), look: new THREE.Vector3(0, 1.0, 0) },
      // 0.22 - Quality Assurance: Camera swoops down to inspect crystalline solar panels
      { pos: new THREE.Vector3(-4.5, 1.6, 2.5), look: new THREE.Vector3(-5.5, 0.4, -2.5) },
      // 0.45 - BESS Storage: Camera pivots around the BESS container and glowing LEDs
      { pos: new THREE.Vector3(4.8, 1.8, 1.2), look: new THREE.Vector3(6.5, 0.6, -2.5) },
      // 0.68 - Engineering & Advisory: High-angle panoramic view overlooking the full grid
      { pos: new THREE.Vector3(-1.5, 6.5, 4.0), look: new THREE.Vector3(0, 0, -10) },
      // 0.88 - Digital Intelligence / Contact: Floating into the radiant sunset glow
      { pos: new THREE.Vector3(2.0, 2.8, -1.0), look: new THREE.Vector3(12, 8, -25) },
      // 1.0 - Finale
      { pos: new THREE.Vector3(0, 4.0, 10), look: new THREE.Vector3(0, 1.5, -15) },
    ];

    function getInterpolatedCamera(t: number) {
      const clamped = Math.max(0, Math.min(0.999, t));
      const segments = cameraWaypoints.length - 1;
      const index = Math.floor(clamped * segments);
      const fraction = (clamped * segments) - index;

      const pA = cameraWaypoints[index].pos;
      const pB = cameraWaypoints[index + 1].pos;
      const lA = cameraWaypoints[index].look;
      const lB = cameraWaypoints[index + 1].look;

      // Smooth ease-in-out
      const smoothFraction = fraction * fraction * (3 - 2 * fraction);

      return {
        pos: new THREE.Vector3().lerpVectors(pA, pB, smoothFraction),
        look: new THREE.Vector3().lerpVectors(lA, lB, smoothFraction),
      };
    }

    // 6. ANIMATION LOOP
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth inertia lerp for scroll progress
      currentProgress.current += (targetProgress.current - currentProgress.current) * 0.075;

      const { pos: targetCamPos, look: targetLook } = getInterpolatedCamera(currentProgress.current);

      // Subtle idle breathing motion
      targetCamPos.x += Math.sin(elapsed * 0.4) * 0.08;
      targetCamPos.y += Math.cos(elapsed * 0.3) * 0.05;

      camera.position.copy(targetCamPos);
      camera.lookAt(targetLook);

      // Animate floating particles
      const pPos = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pPos[i * 3 + 1] += particleVelocities[i].y;
        pPos[i * 3] += particleVelocities[i].x;

        if (pPos[i * 3 + 1] > 14) {
          pPos[i * 3 + 1] = 0;
          pPos[i * 3] = (Math.random() - 0.5) * 40;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Pulse the LED strip on BESS unit
      ledMat.color.setHSL(0.42, 0.9, 0.5 + Math.sin(elapsed * 2.5) * 0.2);

      // Subtle light tube pulsation
      tubeMat.opacity = 0.35 + Math.sin(elapsed * 1.8) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    // 7. RESIZE HANDLER
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
