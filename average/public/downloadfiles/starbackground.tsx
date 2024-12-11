import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const StarsBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene, Camera, Renderer 설정
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // 별 생성
    const starCount = 1000;
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true, // 별 색상 지원
    });

    const positions = new Float32Array(starCount * 2);
    const colors = new Float32Array(starCount * 2);
    const velocities = new Float32Array(starCount * 2); // 별의 초기 속도
    for (let i = 0; i < starCount; i++) {
      // 위치
      positions[i * 3] = (Math.random() - 0.5) * 10; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z

      // 색상
      const color = new THREE.Color(Math.random(), Math.random(), Math.random());
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // 초기 속도
      velocities[i * 3] = (Math.random() - 0.5) * 0.02; // x 속도
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02; // y 속도
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02; // z 속도
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 반짝임 애니메이션
    let clock = new THREE.Clock();

    const animateStars = () => {
      const time = clock.getElapsedTime();
      const positionAttr = starGeometry.getAttribute("position") as THREE.BufferAttribute;

      for (let i = 0; i < starCount; i++) {
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        const z = positions[i * 3 + 2];

        // 반짝이는 효과 (크기 변동)
        const sparkle = Math.sin(time * 5 + i) * 0.01;
        positionAttr.array[i * 3] = x + velocities[i * 3] * sparkle;
        positionAttr.array[i * 3 + 1] = y + velocities[i * 3 + 1] * sparkle;
        positionAttr.array[i * 3 + 2] = z + velocities[i * 3 + 2] * sparkle;
      }
      positionAttr.needsUpdate = true;
    };

    // 마우스 클릭 효과
    const handleMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(stars);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        for (let i = 0; i < starCount; i++) {
          // 클릭 위치에서 별들이 튕겨나가도록 속도 설정
          velocities[i * 3] += (positions[i * 3] - point.x) * 0.1;
          velocities[i * 3 + 1] += (positions[i * 3 + 1] - point.y) * 0.1;
          velocities[i * 3 + 2] += (positions[i * 3 + 2] - point.z) * 0.1;
        }
      }
    };
    window.addEventListener("click", handleMouseClick);

    // 애니메이션 루프
    const animate = () => {
      requestAnimationFrame(animate);

      animateStars();
      stars.rotation.x += 0.0005; // 별의 전체 회전
      stars.rotation.y += 0.001;

      renderer.render(scene, camera);
    };
    animate();

    // 윈도우 리사이즈 처리
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 클린업
    return () => {
      window.removeEventListener("click", handleMouseClick);
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default StarsBackground;
