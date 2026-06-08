<template>
  <q-page class="view-page q-pa-md">
    <q-banner v-if="error" class="bg-negative text-white q-mb-md rounded-borders">
      {{ error }}
      <template #action>
        <q-btn flat :label="$t('view.open')" :to="{ name: 'builder' }" />
      </template>
    </q-banner>

    <template v-else>
      <div class="view-page__head">
        <div class="text-h5 ellipsis">{{ displayName }}</div>
        <q-chip v-if="grade" dense square color="grey-3" text-color="dark">{{ grade }}</q-chip>
        <q-badge color="grey-7" :label="$t('view.readonly')" />
      </div>

      <div class="view-page__board">
        <BoardCanvas :editable="false" />
      </div>

      <div class="view-page__actions">
        <q-btn color="primary" icon="edit" :label="$t('view.open')" no-caps @click="openInBuilder" />
        <q-btn flat icon="save" :label="$t('view.save')" no-caps @click="onSave" />
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useBoardStore } from 'src/stores/board';
import { useRouteStore } from 'src/stores/route';
import { decodeRoute } from 'src/lib/routeCodec';
import BoardCanvas from 'components/BoardCanvas.vue';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const { t } = useI18n();
const board = useBoardStore();
const routeStore = useRouteStore();

const error = ref('');
const name = ref('');
const grade = ref('');

const displayName = computed(() => name.value || t('routes.untitled'));

function queryString(key: string): string {
  const v = route.query[key];
  return typeof v === 'string' ? v : '';
}

// Декодируем синхронно в setup — до монтирования BoardCanvas, чтобы доска сразу
// отрисовала верную раскладку (без промежуточного пустого кадра).
const decoded = decodeRoute(queryString('r'));
if (!decoded) {
  error.value = t('view.invalid');
} else if (decoded.cols !== board.config.cols || decoded.rows !== board.config.rows) {
  error.value = t('view.wrongBoard');
} else {
  name.value = queryString('n');
  grade.value = queryString('g');
  routeStore.loadFromPayload(decoded.holds, name.value, grade.value);
}

function openInBuilder() {
  void router.push({ name: 'builder' });
}

function onSave() {
  void (async () => {
    await routeStore.saveCurrent();
    $q.notify({ type: 'positive', message: t('view.saved'), position: 'top' });
  })();
}
</script>

<style scoped>
.view-page {
  display: flex;
  flex-direction: column;
}
.view-page__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.view-page__board {
  flex: 1 1 auto;
  min-height: 320px;
}
.view-page__actions {
  display: flex;
  gap: 8px;
  padding-top: 8px;
}
</style>
