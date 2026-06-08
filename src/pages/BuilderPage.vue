<template>
  <q-page class="builder">
    <RouteToolbar />

    <div class="builder__content">
      <div class="builder__board">
        <BoardCanvas editable />
      </div>

      <aside class="builder__panel">
        <BrushPalette />
        <div class="builder__count text-caption text-grey-7">
          {{ $t('builder.count', { n: routeStore.count }) }}
        </div>
      </aside>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouteStore } from 'src/stores/route';
import RouteToolbar from 'components/RouteToolbar.vue';
import BoardCanvas from 'components/BoardCanvas.vue';
import BrushPalette from 'components/BrushPalette.vue';

const routeStore = useRouteStore();
</script>

<style scoped>
/* q-page (min-height = вьюпорт минус хедер) — flex-колонка: тулбар сверху, ниже доска+палитра. */
.builder {
  display: flex;
  flex-direction: column;
}
.builder__content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  min-height: 0;
}
.builder__board {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
}
.builder__panel {
  flex: 0 0 220px;
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-left: 1px solid rgba(127, 127, 127, 0.2);
}
.builder__count {
  margin-top: auto;
  padding: 8px;
}

/* Мобильный: доска сверху, палитра снизу. */
@media (max-width: 1023px) {
  .builder__content {
    flex-direction: column;
  }
  .builder__panel {
    flex: 0 0 auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-left: none;
    border-top: 1px solid rgba(127, 127, 127, 0.2);
  }
  .builder__count {
    margin-top: 0;
  }
}
</style>
