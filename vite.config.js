import { defineConfig } from "vite";

export default defineConfig({
  root: ".", // 프로젝트 루트 디렉토리 설정
  build: {
    rollupOptions: {
      input: {
        main: "shared.html", // 기본 진입점을 shared.html로 설정
      },
    },
    outDir: "dist", // 빌드 출력 디렉토리
  },
});
