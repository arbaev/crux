<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">{{ $t('notFound.code') }}</div>

      <div class="text-h2" style="opacity: 0.4">{{ $t('notFound.message') }}</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="primary"
        unelevated
        to="/"
        :label="$t('notFound.goHome')"
        no-caps
      />
    </div>
  </div>
</template>
