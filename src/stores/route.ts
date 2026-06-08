// Стор активной трассы: кисть, роли зацепов, метаданные и персистентность (IndexedDB).
// Единственный источник правды; Three.js-слой только ОТРАЖАЕТ этот стейт (инвариант §4).
// Доступ к БД инкапсулирован в lib/db.ts — стор не знает деталей IndexedDB.
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Brush, GradeSystem, HoldRole, Route, RouteHold } from 'src/types/board';
import { useBoardStore } from 'src/stores/board';
import { getAllRoutes, putRoute, deleteRoute as dbDeleteRoute } from 'src/lib/db';

export const useRouteStore = defineStore('route', () => {
  // --- активная трасса ---
  const brush = ref<Brush>('hand');
  // holdId -> роль. Map даёт O(1) доступ; в Route.holds сериализуется при сохранении.
  const holdRoles = ref(new Map<string, HoldRole>());
  // Счётчик ревизий: рендер следит за ним вместо deep-watch по Map.
  const revision = ref(0);

  // --- метаданные текущей трассы ---
  const name = ref('');
  const grade = ref('');
  const gradeSystem = ref<GradeSystem>('font');
  const currentId = ref<string | null>(null); // id, если трасса уже сохранена

  // --- список сохранённых трасс ---
  const savedRoutes = ref<Route[]>([]);

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
      holdRoles.value.delete(id);
    } else {
      holdRoles.value.set(id, brush.value);
    }
    revision.value++;
  }

  function clear() {
    holdRoles.value.clear();
    revision.value++;
  }

  function serializeHolds(): RouteHold[] {
    return [...holdRoles.value.entries()].map(([holdId, role]) => ({ holdId, role }));
  }

  // Загрузить список из БД (newest-first).
  async function loadSavedRoutes() {
    const all = await getAllRoutes();
    savedRoutes.value = all.reverse();
  }

  // Сохранить текущую трассу (create-or-update по currentId).
  async function saveCurrent(): Promise<Route> {
    const board = useBoardStore();
    const now = Date.now();
    const id = currentId.value ?? crypto.randomUUID();
    const existing = savedRoutes.value.find((r) => r.id === id);
    const route: Route = {
      id,
      name: name.value.trim(),
      boardId: board.config.id,
      holds: serializeHolds(),
      gradeSystem: gradeSystem.value,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      ...(grade.value ? { grade: grade.value } : {}),
    };
    await putRoute(route);
    currentId.value = id;
    await loadSavedRoutes();
    return route;
  }

  // Загрузить сохранённую трассу в редактируемый стейт.
  function loadRoute(route: Route) {
    name.value = route.name;
    grade.value = route.grade ?? '';
    gradeSystem.value = route.gradeSystem ?? 'font';
    currentId.value = route.id;
    const m = new Map<string, HoldRole>();
    for (const h of route.holds) m.set(h.holdId, h.role);
    holdRoles.value = m;
    revision.value++;
  }

  async function removeRoute(id: string) {
    await dbDeleteRoute(id);
    if (currentId.value === id) newRoute();
    await loadSavedRoutes();
  }

  async function duplicateRoute(route: Route): Promise<Route> {
    const now = Date.now();
    const copy: Route = {
      ...route,
      id: crypto.randomUUID(),
      name: `${route.name} (копия)`,
      holds: route.holds.map((h) => ({ ...h })),
      createdAt: now,
      updatedAt: now,
    };
    await putRoute(copy);
    await loadSavedRoutes();
    return copy;
  }

  // Полный сброс — начать новую трассу.
  function newRoute() {
    name.value = '';
    grade.value = '';
    gradeSystem.value = 'font';
    currentId.value = null;
    holdRoles.value = new Map();
    revision.value++;
  }

  return {
    brush,
    holdRoles,
    revision,
    count,
    name,
    grade,
    gradeSystem,
    currentId,
    savedRoutes,
    setBrush,
    applyBrush,
    clear,
    serializeHolds,
    loadSavedRoutes,
    saveCurrent,
    loadRoute,
    removeRoute,
    duplicateRoute,
    newRoute,
  };
});
