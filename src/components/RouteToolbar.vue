<template>
  <div class="route-toolbar">
    <q-input
      v-model="routeStore.name"
      class="route-toolbar__name"
      :label="$t('toolbar.name')"
      :placeholder="$t('toolbar.namePlaceholder')"
      dense
      outlined
      clearable
    />

    <GradeSelector
      v-model:system="routeStore.gradeSystem"
      v-model:value="routeStore.grade"
      class="route-toolbar__grade"
    />

    <div class="route-toolbar__actions">
      <q-btn color="primary" icon="save" :label="$t('toolbar.save')" no-caps @click="onSave" />
      <q-btn flat icon="add" :label="$t('toolbar.new')" no-caps @click="routeStore.newRoute()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouteStore } from 'src/stores/route';
import GradeSelector from 'components/GradeSelector.vue';

const $q = useQuasar();
const { t } = useI18n();
const routeStore = useRouteStore();

async function save() {
  await routeStore.saveCurrent();
  $q.notify({ type: 'positive', message: t('toolbar.saved'), position: 'top' });
}

// Обёртка, чтобы не передавать Promise-возвращающую функцию в обработчик события.
function onSave() {
  void save();
}
</script>

<style scoped>
.route-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid rgba(127, 127, 127, 0.2);
}
.route-toolbar__name {
  flex: 1 1 180px;
  min-width: 160px;
}
.route-toolbar__grade {
  flex: 2 1 280px;
}
.route-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
