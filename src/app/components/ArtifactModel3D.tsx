import * as React from "react";
const { useRef, useState, useEffect } = React;
import { RotateCw, Maximize2, Minimize2, ZoomIn, ZoomOut, Loader2, Pause, Play } from "lucide-react";
import * as THREE from "three";

// 导入模型文件
import modelFile from "@/assets/models/glbfile.glb";
import { useLanguage } from "../contexts/LanguageContext";

interface ArtifactModel3DProps {
  modelType: "vase" | "jade" | "painting" | "embroidery" | "inkstone";
  imageSrc: string;
  modelPath?: string;
}

export function ArtifactModel3D({ modelType, imageSrc, modelPath }: ArtifactModel3DProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(autoRotate);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const controlsRef = useRef<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    console.log('初始化3D场景');

    // 初始化场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    // 初始化相机
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4a90e2, 0.5, 10);
    pointLight.position.set(2, 3, 2);
    scene.add(pointLight);

    // 加载GLB模型
    console.log('加载模型文件:', modelFile);
    
    // 加载OrbitControls和GLTFLoader
    Promise.all([
      import('three/addons/loaders/GLTFLoader.js'),
      import('three/addons/controls/OrbitControls.js')
    ])
      .then(([{ GLTFLoader: RealGLTFLoader }, { OrbitControls: RealOrbitControls }]) => {
        const controls = new RealOrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.rotateSpeed = 0.8;
        controls.zoomSpeed = 0.8;
        controls.minDistance = 1.5;
        controls.maxDistance = 20;
        controls.update();
        controlsRef.current = controls;

        const loader = new RealGLTFLoader();
        const loadSource = modelPath || modelFile;
        loader.load(
          loadSource,
          (gltf) => {
            console.log('模型加载成功:', gltf.scene);
            modelRef.current = gltf.scene;
            
            // 调整模型位置和缩放
            gltf.scene.position.set(0, 0, 0);
            
            // 计算模型的边界框
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const size = box.getSize(new THREE.Vector3());
            const maxSize = Math.max(size.x, size.y, size.z);
            
            // 自动缩放模型以适应场景
            const scale = 3 / maxSize;
            gltf.scene.scale.set(scale, scale, scale);
            
            // 调整模型位置，使其居中
            const center = box.getCenter(new THREE.Vector3());
            gltf.scene.position.sub(center.multiplyScalar(scale));
            
            scene.add(gltf.scene);
            setLoading(false);
            setError(false);
          },
          (progress) => {
            console.log(`加载进度: ${(progress.loaded / progress.total) * 100}%`);
          },
          (error) => {
            console.error('模型加载失败:', error);
            createDefaultModel();
          }
        );
      })
      .catch((error) => {
        console.error('无法加载GLTFLoader或OrbitControls:', error);
        createDefaultModel();
      });

    // 创建默认模型作为备用
    function createDefaultModel() {
      console.log('创建默认模型');
      const geometry = new THREE.SphereGeometry(1.5, 32, 32);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0xff6b6b, 
        metalness: 0.3, 
        roughness: 0.4 
      });
      const sphere = new THREE.Mesh(geometry, material);
      modelRef.current = sphere;
      scene.add(sphere);
      setLoading(false);
      setError(true);
    }

    // 动画循环
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // 自动旋转模型
      if (autoRotateRef.current && modelRef.current) {
        modelRef.current.rotation.y += 0.005;
      }
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };
    animate();

    // 响应式调整
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      controlsRef.current?.update();
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [modelPath]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    window.addEventListener("fullscreenchange", updateFullscreenState);
    return () => window.removeEventListener("fullscreenchange", updateFullscreenState);
  }, []);

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const toggleAutoRotate = () => {
    setAutoRotate((prev) => {
      const next = !prev;
      autoRotateRef.current = next;
      return next;
    });
  };

  const zoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
      controlsRef.current.update();
    }
  };

  const zoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
      controlsRef.current.update();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-white rounded-xl overflow-hidden select-none"
    >
      {/* 3D 展示区域 - Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* 加载指示器 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="text-center text-white">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
            <p>{t('加载中...')}</p>
          </div>
        </div>
      )}
      
      {/* 错误提示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="text-center text-white">
            <p>{t('3D模型加载失败')}</p>
            <p className="text-sm mt-2 text-gray-300">{t('显示默认模型')}</p>
          </div>
        </div>
      )}

      {/* 光效 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* 控制按钮 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full z-10">
        <button
          onClick={resetView}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          title="重置视角"
        >
          <RotateCw className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={toggleAutoRotate}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          title={autoRotate ? "暂停自动旋转" : "开启自动旋转"}
        >
          {autoRotate ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
        </button>
        <button
          onClick={zoomIn}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          title="放大"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          title="缩小"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          title={isFullscreen ? "退出全屏" : "全屏"}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5 text-white" /> : <Maximize2 className="w-5 h-5 text-white" />}
        </button>
      </div>

      {/* 提示文字 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full z-10">
        <p className="text-white text-sm">
          拖动旋转 · {autoRotate ? '自动旋转已开启' : '自动旋转已暂停'}
        </p>
      </div>

      {/* 信息显示 */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
        <p className="text-white text-xs">
          {modelPath ? (loading ? '加载中...' : '模型已加载') : '使用默认模型'}
        </p>
      </div>
    </div>
  );
}
