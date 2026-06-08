<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{ $t('appTitle') }}</q-toolbar-title>
        <div class="text-caption">Quasar v{{ $q.version }}</div>
      </q-toolbar>

      <q-tabs align="left" no-caps inline-label>
        <q-route-tab :to="{ name: 'builder' }" exact icon="grid_on" :label="$t('nav.builder')" />
        <q-route-tab :to="{ name: 'routes' }" icon="list" :label="$t('nav.routes')" />
        <q-route-tab :to="{ name: 'view' }" icon="visibility" :label="$t('nav.view')" />
        <q-route-tab :to="{ name: 'about' }" icon="info" :label="$t('nav.about')" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
