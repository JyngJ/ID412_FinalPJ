import * as THREE from "three";

const rectangles = []; // 직사각형 객체 리스트

// 텍스트를 줄바꿈 처리하는 헬퍼 함수
function wrapText(text, maxLineLength) {
  const words = text.split(" ");
  let currentLine = "";
  const lines = [];

  words.forEach((word) => {
    if ((currentLine + word).length > maxLineLength) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  });

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines.join("\n");
}

// 텍스트로 크기를 계산하는 헬퍼 함수
function calculateTextDimensions(text, fontSize = 18) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = `${fontSize}px Arial`;
  const lines = text.split("\n");
  const width = Math.max(
    ...lines.map((line) => context.measureText(line).width)
  );
  const height = fontSize * lines.length; // 줄 수에 따라 높이 계산
  return { width, height };
}

const dummyData = Array.from({ length: 10 }, () => ({
  title: "This is a dummy title for google search",
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR_hG_gUvQyLjCxYFE7crTd4w2F7CtXgxHzg&s",
  snippet:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
}));

// 랜덤 3D 상자 생성 함수
export async function createRandomRectangle(scene, data = dummyData) {
  const randomData = data[Math.floor(Math.random() * data.length)];
  const choice = Math.random();
  let face = Math.floor(Math.random() * 3); // 0 = X, 1 = Y, 2 = Z
  let boxDimensions, mappedMaterial;

  if (choice < 0.33 && randomData.image) {
    // 이미지 선택
    const textureLoader = new THREE.TextureLoader();
    const texture = await new Promise((resolve, reject) => {
      textureLoader.load(randomData.image, resolve, undefined, reject);
    });

    const aspectRatio = texture.image.width / texture.image.height;
    const width = Math.random() * 30 + 70; // 가로 크기 (70 ~ 100)
    const height = width / aspectRatio; // 세로 크기
    const depth = Math.random() * 10 + 5; // 나머지 면의 깊이 (5 ~ 15)

    boxDimensions = [width, height, depth];
    mappedMaterial = new THREE.MeshBasicMaterial({ map: texture });
  } else {
    // 텍스트 선택 (title 또는 snippet)
    const isTitle = choice < 0.66;
    const rawText = isTitle ? randomData.title : randomData.snippet;
    const text = wrapText(rawText, 30);
    const fontSize = isTitle ? 8 : 6; // title: 8, snippet: 6
    const fontColor = isTitle ? "blue" : "black"; // title: blue, snippet: black
    const { width, height } = calculateTextDimensions(text, fontSize);
    const depth = Math.random() * 10 + 5; // 나머지 면의 깊이 (5 ~ 15)

    boxDimensions = [width, height, depth];

    // 텍스트 렌더링
    const textCanvas = document.createElement("canvas");
    const resolutionMultiplier = 4; // 고해상도 캔버스
    textCanvas.width = width * resolutionMultiplier;
    textCanvas.height = height * resolutionMultiplier;

    const textContext = textCanvas.getContext("2d");
    textContext.scale(resolutionMultiplier, resolutionMultiplier);
    textContext.font = `${fontSize}px Arial`;
    textContext.fillStyle = "white";
    textContext.fillRect(0, 0, width, height);
    textContext.fillStyle = fontColor;

    const lines = text.split("\n");
    lines.forEach((line, index) => {
      textContext.fillText(line, 0, fontSize * (index + 1));
    });

    const textTexture = new THREE.CanvasTexture(textCanvas);
    mappedMaterial = new THREE.MeshBasicMaterial({ map: textTexture });
    mappedMaterial.transparent = true;
  }

  // 3D 상자 기하와 기본 재질 생성
  const depthForFace = Math.random() * 5 + 5; // 5 ~ 15 깊이 설정
  const adjustedBoxDimensions = [...boxDimensions];
  if (face === 0) {
    adjustedBoxDimensions[0] = depthForFace; // X 면 제외, 다른 면의 깊이 조정
  } else if (face === 1) {
    adjustedBoxDimensions[1] = depthForFace; // Y 면 제외, 다른 면의 깊이 조정
  } else if (face === 2) {
    adjustedBoxDimensions[2] = depthForFace; // Z 면 제외, 다른 면의 깊이 조정
  }

  const geometry = new THREE.BoxGeometry(...adjustedBoxDimensions);

  const baseMaterial = new THREE.MeshBasicMaterial({
    color: Math.random() * 0xffffff,
    wireframe: false,
  });

  // 각 면의 재질 설정
  const materials = [
    face === 0 ? mappedMaterial : baseMaterial, // +X
    face === 0 ? mappedMaterial : baseMaterial, // -X
    face === 1 ? mappedMaterial : baseMaterial, // +Y
    face === 1 ? mappedMaterial : baseMaterial, // -Y
    face === 2 ? mappedMaterial : baseMaterial, // +Z
    face === 2 ? mappedMaterial : baseMaterial, // -Z
  ];

  const rectangle = new THREE.Mesh(geometry, materials);

  // 랜덤 X 위치
  const x = (Math.random() - 0.5) * 400;
  const y = 0;
  const z = -2000;

  // 랜덤 회전
  const rotationX = THREE.MathUtils.degToRad((Math.random() - 0.5) * 40);
  const rotationY = THREE.MathUtils.degToRad((Math.random() - 0.5) * 40);
  const rotationZ = THREE.MathUtils.degToRad((Math.random() - 0.5) * 40);

  // 위치 및 회전 설정
  rectangle.position.set(x, y, z);
  rectangle.rotation.set(rotationX, rotationY, rotationZ);

  // Scene에 추가
  scene.add(rectangle);
  rectangles.push(rectangle);
}

// 현재 상자 리스트 반환
export function getRectangles() {
  return rectangles;
}
