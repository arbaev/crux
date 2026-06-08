<template>
  <div class="brush-palette">
    <q-btn
      v-for="b in BRUSHES"
      :key="b.brush"
      class="brush-palette__btn"
      :class="{ 'brush-palette__btn--active': routeStore.brush === b.brush }"
      :style="{ '--swatch': b.color }"
      :icon="b.icon"
      :label="$t(b.i18nKey)"
      flat
      no-caps
      align="left"
      @click="routeStore.setBrush(b.brush)"
    />

    <q-separator class="brush-palette__sep" />

    <q-btn
      flat
      no-caps
      icon="delete_sweep"
      :label="$t('builder.reset')"
      @click="routeStore.clear()"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouteStore } from 'src/stores/route';
import { BRUSHES } from 'src/lib/roles';

const routeStore = useRouteStore();
</script>

<style scoped>
.brush-palette {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.brush-palette__btn {
  border-left: 6px solid var(--swatch);
  border-radius: 4px;
}
.brush-palette__btn--active {
  background: rgba(127, 127, 127, 0.18);
  font-weight: 600;
}
.brush-palette__sep {
  margin: 6px 0;
}

/* Мобильный layout: палитра в ряд снизу. */
@media (max-width: 1023px) {
  .brush-palette {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .brush-palette__sep {
    display: none;
  }
}
</style>
