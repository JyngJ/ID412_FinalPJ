import * as THREE from "three";
import { createRandomRectangle } from "./rectangleBuilder.js";
import { animate } from "./animationMgr.js";

// Scene 생성
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // 검은 배경

// 렌더러 생성
const renderer = new THREE.WebGLRenderer({ antialias: true }); // 안티앨리어싱 추가
renderer.setPixelRatio(window.devicePixelRatio * 2); // 해상도 배율 증가
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // 렌더러 DOM 추가

// 조명 추가
function addLights(scene) {
  // 방향성 조명
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(50, 50, 400); // 빛의 위치 설정
  scene.add(directionalLight);

  // 환경광 추가
  const ambientLight = new THREE.AmbientLight(0x404040, 2); // 은은한 조명
  scene.add(ambientLight);
}
addLights(scene); // 조명을 씬에 추가

let camera;
function updateRendererAndCamera() {
  const width = window.innerWidth; // 현재 창 가로 길이
  const height = width * (602 / 3595); // 세로 길이 = 가로 길이 * (602 / 3595)

  // 렌더러 크기 업데이트
  renderer.setSize(width, height);
  renderer.domElement.style.width = `${width}px`; // CSS 가로 길이 설정
  renderer.domElement.style.height = `${height}px`; // CSS 세로 길이 설정

  // Orthographic 카메라 설정
  const aspectRatio = width / height;
  const frustumHeight = 20; // 카메라의 세로 길이
  const frustumWidth = frustumHeight * aspectRatio;

  if (!camera) {
    camera = new THREE.PerspectiveCamera(
      5, // 시야각 (FOV)
      width / height, // 화면 비율
      0.1, // near 클리핑 평면
      2001 // far 클리핑 평면
    );
    camera.position.z = 300; // Z축에서 카메라 위치 고정
    camera.position.y = 50;
  } else {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}
updateRendererAndCamera();
document.body.appendChild(renderer.domElement); // 렌더러 DOM 추가

// 창 크기 변경에 따른 처리
window.addEventListener("resize", updateRendererAndCamera);

// 일정 간격으로 직사각형 생성
setInterval(() => createRandomRectangle(scene), 1000); // 1초마다 상자 생성

// 애니메이션 시작
animate(scene, renderer, camera);
