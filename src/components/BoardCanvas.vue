<template>
  <div ref="containerEl" class="board-canvas">
    <canvas ref="canvasEl" class="board-canvas__canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBoardStore } from 'src/stores/board';
import { useRouteStore } from 'src/stores/route';
import { useThreeBoard } from 'src/composables/useThreeBoard';

const props = withDefaults(defineProps<{ editable?: boolean }>(), { editable: false });

const boardStore = useBoardStore();
const routeStore = useRouteStore();

const containerEl = ref<HTMLElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);

// Единственное место связки стора и рендера (инвариант §4).
const board = useThreeBoard({
  canvas: canvasEl,
  container: containerEl,
  positions: boardStore.positions,
  config: boardStore.config,
  getRoles: () => routeStore.holdRoles,
  editable: props.editable,
  onHoldTap: props.editable ? (id: string) => routeStore.applyBrush(id) : undefined,
});

// Рендер следит за ревизией стора и пересинхронизируется (render-on-demand).
watch(
  () => routeStore.revision,
  () => board.sync(),
);
</script>

<style scoped>
.board-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
}
.board-canvas__canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none; /* pointer-события вместо нативного скролла/зума по канвасу */
}
</style>
