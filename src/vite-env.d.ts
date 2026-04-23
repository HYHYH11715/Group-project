/// <reference types="vite/client" />

// 声明glb模块类型
declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.gltf' {
  const src: string;
  export default src;
}
