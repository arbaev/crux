<template>
  <div class="grade-selector row q-col-gutter-sm">
    <q-select
      class="col-12 col-sm"
      :model-value="system"
      :options="systemOptions"
      :label="$t('grade.system')"
      dense
      outlined
      emit-value
      map-options
      @update:model-value="onSystem"
    >
      <template #append>
        <q-icon
          name="help_outline"
          size="20px"
          class="cursor-pointer"
          @click.stop.prevent
          @mousedown.stop.prevent
        >
          <q-tooltip max-width="300px" class="text-body2">
            {{ $t('grade.systemHint') }}
          </q-tooltip>
        </q-icon>
      </template>
    </q-select>

    <q-select
      v-if="hasValueList(system)"
      class="col-12 col-sm"
      :model-value="value"
      :options="GRADE_VALUES[system] ?? []"
      :label="$t('grade.value')"
      dense
      outlined
      clearable
      use-input
      input-debounce="0"
      new-value-mode="add-unique"
      @update:model-value="onValue"
    />
    <q-input
      v-else
      class="col-12 col-sm"
      :model-value="value"
      :label="$t('grade.value')"
      dense
      outlined
      clearable
      @update:model-value="onValue"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { GradeSystem } from 'src/types/board';
import { GRADE_VALUES, hasValueList } from 'src/lib/grades';

defineProps<{ system: GradeSystem; value: string }>();
const emit = defineEmits<{
  'update:system': [system: GradeSystem];
  'update:value': [value: string];
}>();

const { t } = useI18n();

// Литеральные i18n-ключи (без динамики — иначе строгая типизация ключей ругается).
const systemOptions = computed<{ value: GradeSystem; label: string }[]>(() => [
  { value: 'font', label: t('grade.systems.font') },
  { value: 'v', label: t('grade.systems.v') },
  { value: 'french', label: t('grade.systems.french') },
  { value: 'color', label: t('grade.systems.color') },
  { value: 'custom', label: t('grade.systems.custom') },
]);

function onSystem(val: unknown) {
  emit('update:system', val as GradeSystem);
  emit('update:value', ''); // при смене системы сбрасываем значение
}

function onValue(val: string | number | null) {
  emit('update:value', val == null ? '' : String(val));
}
</script>
