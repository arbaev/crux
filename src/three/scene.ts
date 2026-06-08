// Сцена/камера/свет/рендерер + стена. Render-on-demand (сцена статична в M1).
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  Color,
  Vector2,
  Raycaster,
  MathUtils,
} from 'three';
import type { BoardConfig } from 'src/types/board';

export interface SceneApi {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  raycaster: Raycaster;
  pointer: Vector2;
  render(): void;
  resize(): void;
  dispose(): void;
}

const MARGIN = 1.12; // запас вокруг доски при подгонке кадра
const TILT = 0.12; // лёгкий наклон обзора (доля дистанции по вертикали)

export function createScene(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  config: BoardConfig,
): SceneApi {
  const scene = new Scene();
  scene.background = new Color('#1d1f23');

  const camera = new PerspectiveCamera(45, 1, 0.1, 1000);

  scene.add(new AmbientLight(0xffffff, 0.75));
  const dir = new DirectionalLight(0xffffff, 0.85);
  dir.position.set(2, 4, 6);
  scene.add(dir);

  // Матовая стена под сеткой.
  const planeW = config.cols * config.spacing + config.spacing;
  const planeH = config.rows * config.spacing + config.spacing;
  const plane = new Mesh(
    new PlaneGeometry(planeW, planeH),
    new MeshStandardMaterial({ color: new Color('#2c2f36'), roughness: 0.95, metalness: 0 }),
  );
  scene.add(plane);

  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const raycaster = new Raycaster();
  const pointer = new Vector2();

  function render() {
    renderer.render(scene, camera);
  }

  // Подгоняем дистанцию камеры так, чтобы вся доска (с запасом) помещалась при текущем аспекте.
  function frame() {
    const aspect = camera.aspect;
    const vFov = MathUtils.degToRad(camera.fov);
    const halfH = planeH / 2;
    const halfW = planeW / 2;
    const distH = halfH / Math.tan(vFov / 2);
    const distW = halfW / (Math.tan(vFov / 2) * aspect);
    const dist = Math.max(distH, distW) * MARGIN;
    camera.position.set(0, dist * TILT, dist);
    camera.lookAt(0, 0, 0);
  }

  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    frame();
  }

  function dispose() {
    plane.geometry.dispose();
    plane.material.dispose();
    renderer.dispose();
  }

  return { scene, camera, renderer, raycaster, pointer, render, resize, dispose };
}
