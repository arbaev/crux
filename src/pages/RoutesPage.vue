<template>
  <q-page class="routes-page q-pa-md">
    <div class="text-h5 q-mb-md">{{ $t('pages.routes.title') }}</div>

    <div v-if="routeStore.savedRoutes.length === 0" class="routes-page__empty text-grey-6">
      <q-icon name="route" size="48px" />
      <div class="q-mt-sm">{{ $t('routes.empty') }}</div>
    </div>

    <div v-else class="routes-page__grid">
      <RouteCard
        v-for="r in routeStore.savedRoutes"
        :key="r.id"
        :route="r"
        @open="onOpen"
        @duplicate="onDuplicate"
        @delete="onDelete"
        @share="onShare"
      />
    </div>

    <ShareDialog
      v-model="shareOpen"
      :holds="shareRoute?.holds ?? []"
      :name="shareRoute?.name ?? ''"
      :grade="shareRoute?.grade ?? ''"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import type { Route } from 'src/types/board';
import { useRouteStore } from 'src/stores/route';
import RouteCard from 'components/RouteCard.vue';
import ShareDialog from 'components/ShareDialog.vue';

const router = useRouter();
const $q = useQuasar();
const { t } = useI18n();
const routeStore = useRouteStore();

const shareOpen = ref(false);
const shareRoute = ref<Route | null>(null);

function onShare(route: Route) {
  shareRoute.value = route;
  shareOpen.value = true;
}

onMounted(() => {
  void routeStore.loadSavedRoutes();
});

function onOpen(route: Route) {
  routeStore.loadRoute(route);
  void router.push({ name: 'builder' });
}

function onDuplicate(route: Route) {
  void (async () => {
    await routeStore.duplicateRoute(route);
    $q.notify({ type: 'positive', message: t('routes.duplicated'), position: 'top' });
  })();
}

function onDelete(route: Route) {
  $q.dialog({
    title: t('routes.delete'),
    message: t('routes.confirmDelete', { name: route.name || t('routes.untitled') }),
    cancel: true,
  }).onOk(() => {
    void (async () => {
      await routeStore.removeRoute(route.id);
      $q.notify({ type: 'info', message: t('routes.deleted'), position: 'top' });
    })();
  });
}
</script>

<style scoped>
.routes-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.routes-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  text-align: center;
}
</style>
