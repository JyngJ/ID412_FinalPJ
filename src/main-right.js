import * as THREE from "three";
import { addCamera, updateRendererSize } from "./sharedScene.js";

// 창 높이에 따른 비율 계산
const height = window.innerHeight;
const width = (1675 / 602) * height; // 오른쪽 화면 비율에 따른 너비

// 카메라 생성
const camera = new THREE.PerspectiveCamera(
  75, // FOV
  width / height, // Aspect Ratio
  0.1, // Near
  1000 // Far
);
camera.position.z = 5; // 기본 Z축
camera.position.x = 0; // 오른쪽 중심

// 카메라를 shared-scene에 추가
addCamera(camera, { x: (1920 / 602) * height, y: 0, width, height });

// 애니메이션 및 렌더러 크기 업데이트
updateRendererSize();
