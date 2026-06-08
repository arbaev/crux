<template>
  <q-card class="route-card" flat bordered>
    <!-- 2D мини-превью трассы (без Three.js, переиспользует ROLE_COLORS). -->
    <div class="route-card__preview" :style="gridStyle">
      <span
        v-for="cell in cells"
        :key="cell.id"
        class="route-card__cell"
        :style="{ background: cell.color }"
      />
    </div>

    <q-card-section class="q-pb-none">
      <div class="text-subtitle1 ellipsis">{{ route.name || $t('routes.untitled') }}</div>
      <div class="row items-center q-gutter-xs q-mt-xs">
        <q-chip v-if="route.grade" dense square color="grey-3" text-color="dark">
          {{ route.grade }}
        </q-chip>
        <span class="text-caption text-grey-7">
          {{ $t('routes.holds', { n: route.holds.length }) }}
        </span>
      </div>
      <div class="text-caption text-grey-6">{{ formattedDate }}</div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat dense icon="open_in_new" :title="$t('routes.open')" @click="emit('open', route)" />
      <q-btn
        flat
        dense
        icon="content_copy"
        :title="$t('routes.duplicate')"
        @click="emit('duplicate', route)"
      />
      <q-btn flat dense icon="share" :title="$t('routes.share')" @click="emit('share', route)" />
      <q-btn
        flat
        dense
        icon="delete"
        color="negative"
        :title="$t('routes.delete')"
        @click="emit('delete', route)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { HoldRole, Route } from 'src/types/board';
import { useBoardStore } from 'src/stores/board';
import { ROLE_COLORS } from 'src/lib/roles';
import { holdId } from 'src/lib/board';

const props = defineProps<{ route: Route }>();
const emit = defineEmits<{
  open: [route: Route];
  duplicate: [route: Route];
  delete: [route: Route];
  share: [route: Route];
}>();

const board = useBoardStore();

const roleMap = computed(() => {
  const m = new Map<string, HoldRole>();
  for (const h of props.route.holds) m.set(h.holdId, h.role);
  return m;
});

const cells = computed(() => {
  const { cols, rows } = board.config;
  const out: { id: string; color: string }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const id = holdId(col, row);
      const role = roleMap.value.get(id);
      out.push({ id, color: role ? ROLE_COLORS[role] : 'rgba(127, 127, 127, 0.15)' });
    }
  }
  return out;
});

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${board.config.cols}, 1fr)`,
  aspectRatio: `${board.config.cols} / ${board.config.rows}`,
}));

const formattedDate = computed(() => new Date(props.route.updatedAt).toLocaleDateString());
</script>

<style scoped>
.route-card {
  display: flex;
  flex-direction: column;
}
.route-card__preview {
  display: grid;
  gap: 2px;
  padding: 8px;
  background: rgba(127, 127, 127, 0.06);
}
.route-card__cell {
  aspect-ratio: 1;
  border-radius: 50%;
}
</style>
