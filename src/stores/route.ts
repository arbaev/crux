// Стор активной трассы: текущая кисть и роли зацепов. Единственный источник правды.
// Three.js-слой только ОТРАЖАЕТ этот стейт (инвариант §4).
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Brush, HoldRole } from 'src/types/board';

export const useRouteStore = defineStore('route', () => {
  const brush = ref<Brush>('hand');
  // holdId -> роль. Map даёт O(1) доступ; в Route.holds сериализуется при сохранении (M2).
  const holdRoles = ref(new Map<string, HoldRole>());
  // Счётчик ревизий: рендер следит за ним вместо deep-watch по Map.
  const revision = ref(0);

  const count = computed(() => holdRoles.value.size);

  function setBrush(b: Brush) {
    brush.value = b;
  }

  // Применить текущую кисть к зацепу: стереть / снять повтором / назначить роль.
  function applyBrush(id: string) {
    const current = holdRoles.value.get(id);
    if (brush.value === 'erase') {
      holdRoles.value.delete(id);
    } else if (current === brush.value) {
      holdRoles.value.delete(id); // повторный тап той же кистью снимает роль
    } else {
      holdRoles.value.set(id, brush.value);
    }
    revision.value++;
  }

  function clear() {
    holdRoles.value.clear();
    revision.value++;
  }

  return { brush, holdRoles, revision, count, setBrush, applyBrush, clear };
});
