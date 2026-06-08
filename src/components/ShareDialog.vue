<template>
  <q-dialog :model-value="modelValue" @update:model-value="(v) => emit('update:modelValue', v)">
    <q-card class="share-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('share.title') }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>

      <q-card-section>
        <q-input
          :model-value="shareUrl"
          :label="$t('share.link')"
          readonly
          outlined
          dense
          type="textarea"
          autogrow
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          icon="content_copy"
          :label="$t('share.copy')"
          no-caps
          @click="onCopy"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { copyToClipboard, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import type { RouteHold } from 'src/types/board';
import { useBoardStore } from 'src/stores/board';
import { encodeHolds } from 'src/lib/routeCodec';

const props = withDefaults(
  defineProps<{ modelValue: boolean; holds: RouteHold[]; name?: string; grade?: string }>(),
  { name: '', grade: '' },
);
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const router = useRouter();
const $q = useQuasar();
const { t } = useI18n();
const board = useBoardStore();

const shareUrl = computed(() => {
  const r = encodeHolds(props.holds, board.config.cols, board.config.rows);
  const query: Record<string, string> = { r };
  if (props.name) query.n = props.name;
  if (props.grade) query.g = props.grade;
  const href = router.resolve({ name: 'view', query }).href;
  return window.location.origin + href;
});

function onCopy() {
  void (async () => {
    await copyToClipboard(shareUrl.value);
    $q.notify({ type: 'positive', message: t('share.copied'), position: 'top' });
  })();
}
</script>

<style scoped>
.share-dialog {
  min-width: 320px;
  max-width: 520px;
}
</style>
