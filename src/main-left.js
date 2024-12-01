import * as THREE from "three";
import { scene, renderer } from "./sharedScene.js"; // 공유된 Scene과 Renderer 가져오기

// 카메라 생성
const camera = new THREE.PerspectiveCamera(
  75, // FOV
  1920 / 602, // Aspect Ratio (left 화면 비율)
  0.1, // Near
  1000 // Far
);
camera.position.z = 5; // 카메라 위치 Z축
camera.position.x = -(3595 / 2 - 1920 / 2); // 왼쪽 화면 중심

// 렌더러 설정
renderer.setSize(1920, 602); // 왼쪽 화면 해상도
document.body.appendChild(renderer.domElement); // 렌더러 DOM 추가

// 애니메이션 루프
function animateLeftView() {
  requestAnimationFrame(animateLeftView);

  // 렌더러에서 왼쪽 화면만 렌더링
  renderer.setViewport(0, 0, 1920, 602);
  renderer.setScissor(0, 0, 1920, 602);
  renderer.setScissorTest(true);
  renderer.render(scene, camera);
}
animateLeftView();
