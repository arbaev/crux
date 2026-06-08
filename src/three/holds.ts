// Меши зацепов, материалы по ролям и raycast. «Глупый» слой: только отражает стейт.
import {
  SphereGeometry,
  MeshStandardMaterial,
  Mesh,
  Group,
  Color,
  type Raycaster,
} from 'three';
import type { HoldPosition, HoldRole } from 'src/types/board';
import { ROLE_COLORS } from 'src/lib/roles';

const HOLD_RADIUS_RATIO = 0.22; // радиус сферы относительно spacing

// Типизированный userData меша (three хранит userData как Record<string, any>).
interface HoldUserData {
  holdId: string;
}

export interface HoldsApi {
  group: Group;
  meshes: Mesh[];
  sync(roles: Map<string, HoldRole>): void;
  raycast(raycaster: Raycaster): string | null;
  dispose(): void;
}

function createRoleMaterials(): Record<HoldRole | 'off', MeshStandardMaterial> {
  const make = (hex: string) =>
    new MeshStandardMaterial({ color: new Color(hex), roughness: 0.6, metalness: 0.05 });
  return {
    off: make(ROLE_COLORS.off),
    start: make(ROLE_COLORS.start),
    hand: make(ROLE_COLORS.hand),
    foot: make(ROLE_COLORS.foot),
    finish: make(ROLE_COLORS.finish),
  };
}

// Один меш на позицию (общая geometry + общие материалы по ссылке — дёшево для ~100 мешей).
export function createHolds(positions: HoldPosition[], spacing: number): HoldsApi {
  const group = new Group();
  const geometry = new SphereGeometry(spacing * HOLD_RADIUS_RATIO, 24, 16);
  const materials = createRoleMaterials();

  const meshes: Mesh[] = positions.map((p) => {
    const mesh = new Mesh(geometry, materials.off);
    mesh.position.set(p.x, p.y, p.z);
    (mesh.userData as HoldUserData).holdId = p.id;
    group.add(mesh);
    return mesh;
  });

  function sync(roles: Map<string, HoldRole>) {
    for (const mesh of meshes) {
      const id = (mesh.userData as HoldUserData).holdId;
      const role = roles.get(id);
      mesh.material = role ? materials[role] : materials.off;
    }
  }

  function raycast(raycaster: Raycaster): string | null {
    const hit = raycaster.intersectObjects(meshes, false)[0];
    return hit ? (hit.object.userData as HoldUserData).holdId : null;
  }

  function dispose() {
    geometry.dispose();
    for (const m of Object.values(materials)) m.dispose();
    group.clear();
    meshes.length = 0;
  }

  return { group, meshes, sync, raycast, dispose };
}
