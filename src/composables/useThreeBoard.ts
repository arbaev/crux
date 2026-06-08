// Жизненный цикл 3D-доски: init/sync/raycast/dispose. НЕ зависит от Pinia (инвариант §4) —
// получает позиции, конфиг, getRoles() и колбэк onHoldTap; связку со стором делает BoardCanvas.
import { onMounted, onBeforeUnmount, type Ref } from 'vue';
import { createScene, type SceneApi } from 'src/three/scene';
import { createHolds, type HoldsApi } from 'src/three/holds';
import type { BoardConfig, HoldPosition, HoldRole } from 'src/types/board';

export interface UseThreeBoardOptions {
  canvas: Ref<HTMLCanvasElement | null>;
  container: Ref<HTMLElement | null>;
  positions: HoldPosition[];
  config: BoardConfig;
  getRoles: () => Map<string, HoldRole>;
  editable: boolean;
  // exactOptionalPropertyTypes: явно допускаем undefined (для read-only режима).
  onHoldTap?: ((holdId: string) => void) | undefined;
}

export interface ThreeBoardApi {
  sync(): void;
}

export function useThreeBoard(opts: UseThreeBoardOptions): ThreeBoardApi {
  let sceneApi: SceneApi | null = null;
  let holdsApi: HoldsApi | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let canvasEl: HTMLCanvasElement | null = null;

  // Привести вид в соответствие со стейтом и перерисовать (render-on-demand).
  function sync() {
    if (!sceneApi || !holdsApi) return;
    holdsApi.sync(opts.getRoles());
    sceneApi.render();
  }

  function onPointerDown(ev: PointerEvent) {
    if (!sceneApi || !holdsApi || !canvasEl || !opts.onHoldTap) return;
    const rect = canvasEl.getBoundingClientRect();
    sceneApi.pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    sceneApi.pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    sceneApi.raycaster.setFromCamera(sceneApi.pointer, sceneApi.camera);
    const holdId = holdsApi.raycast(sceneApi.raycaster);
    if (holdId) opts.onHoldTap(holdId);
  }

  onMounted(() => {
    const canvas = opts.canvas.value;
    const container = opts.container.value;
    if (!canvas || !container) return;
    canvasEl = canvas;

    sceneApi = createScene(canvas, container, opts.config);
    holdsApi = createHolds(opts.positions, opts.config.spacing);
    sceneApi.scene.add(holdsApi.group);

    sceneApi.resize();
    sync(); // первый рендер с актуальным стейтом

    resizeObserver = new ResizeObserver(() => {
      sceneApi?.resize();
      sceneApi?.render();
    });
    resizeObserver.observe(container);

    if (opts.editable) {
      // Pointer Events — единый путь для мыши и тача.
      canvas.addEventListener('pointerdown', onPointerDown);
    }
  });

  // Полный dispose — защита от утечек WebGL-контекстов при SPA-навигации (§8.4).
  onBeforeUnmount(() => {
    if (canvasEl) canvasEl.removeEventListener('pointerdown', onPointerDown);
    resizeObserver?.disconnect();
    resizeObserver = null;
    holdsApi?.dispose();
    sceneApi?.dispose();
    sceneApi = null;
    holdsApi = null;
    canvasEl = null;
  });

  return { sync };
}
