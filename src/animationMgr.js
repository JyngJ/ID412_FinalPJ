import * as THREE from "three";
import { getRectangles } from "./rectangleBuilder.js";

// 애니메이션 루프 함수
export function animate(scene, renderer, camera) {
  const rectangles = getRectangles();
  const speed = 0.5; // Z축 이동 속도

  // 파도 설정
  const waveAmplitude = 10; // 파도의 진폭
  const waveWavelength = 200; // 파도의 파장 (z 축에서 한 주기의 길이)
  const waveFrequency = 1 / 150; // 파도의 주기 (1 / 주기 초)
  let elapsedTime = 0; // 경과 시간

  function getWaveY(z, time) {
    // 시간에 따라 z축에 따라 이동하는 파도 높이 계산
    const phaseShift = z / waveWavelength; // 공간적 파장에 따른 위상 이동
    return (
      waveAmplitude *
      Math.sin(2 * Math.PI * waveFrequency * time - 2 * Math.PI * phaseShift)
    );
  }

  function shouldRotate() {
    // 30% 확률로 true 반환
    return Math.random() < 0.3;
  }

  function loop(time) {
    requestAnimationFrame(loop);

    elapsedTime = time / 1000; // 시간 업데이트 (초 단위)

    // 각 직사각형의 Z값 이동 및 파도에 따른 Y값 업데이트
    rectangles.forEach((rectangle, index) => {
      rectangle.position.z += speed; // Z값 이동
      rectangle.position.y = getWaveY(rectangle.position.z, elapsedTime); // Y값을 파도 함수로 업데이트

      // 회전 이벤트 처리
      if (rectangle.position.y > 0 && !rectangle.isRotating && shouldRotate()) {
        rectangle.isRotating = true; // 회전 시작
        rectangle.dampingFactor = Math.random() * (0.05 - 0.005) + 0.005; // 0.005 ~ 0.05 사이 랜덤 값
        rectangle.targetRotation = {
          x: rectangle.rotation.x + (Math.random() - 0.5) * 0.5, // -0.05 ~ 0.05 radians
          y: rectangle.rotation.y + (Math.random() - 0.5) * 0.5, // -0.05 ~ 0.05 radians
        };
      }

      if (rectangle.isRotating) {
        const threshold = 0.001; // 멈추는 기준 값

        // 현재 회전을 타겟 회전에 점진적으로 맞춤
        rectangle.rotation.x +=
          (rectangle.targetRotation.x - rectangle.rotation.x) *
          rectangle.dampingFactor; // 랜덤 감속 계수 적용
        rectangle.rotation.y +=
          (rectangle.targetRotation.y - rectangle.rotation.y) *
          rectangle.dampingFactor;

        // 남은 차이가 줄어들수록 속도를 더 천천히 줄이기
        if (
          Math.abs(rectangle.targetRotation.x - rectangle.rotation.x) <
            threshold &&
          Math.abs(rectangle.targetRotation.y - rectangle.rotation.y) <
            threshold
        ) {
          rectangle.isRotating = false; // 회전 종료
          rectangle.rotation.x = rectangle.targetRotation.x; // 최종 위치로 정렬
          rectangle.rotation.y = rectangle.targetRotation.y; // 최종 위치로 정렬
        }
      }

      if (rectangle.position.z >= 200) {
        scene.remove(rectangle); // Z값이 0을 넘으면 제거
        rectangles.splice(index, 1);
      }
    });

    // 렌더링
    renderer.render(scene, camera);
  }

  // 초기 상태 설정
  rectangles.forEach((rectangle) => {
    rectangle.isRotating = false; // 회전 여부 플래그
    rectangle.targetRotation = { x: 0, y: 0 }; // 목표 회전값
    rectangle.dampingFactor = 0; // 감속 계수 초기화
  });

  loop();
}
