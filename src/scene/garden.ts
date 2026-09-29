import {
  Group, Mesh, MeshStandardMaterial, SphereGeometry,
  CylinderGeometry, TorusGeometry, IcosahedronGeometry, InstancedMesh,
  Object3D, BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial,
  Vector3, type Material,
} from 'three';
import type { LevelDefinition, Vec3 } from '../levels/levels.js';
import { samplePath, WATER_RADIUS } from '../game/puzzle.js';
import { TOKENS } from '../theme/tokens.js';

type Controls = { left: Vec3; right: Vec3 };
type Result = { valid: boolean; blocked: boolean; ringsHit: boolean[] };

/** Procedural miniature, in puzzle-local meters. The runtime owns placement. */
export function createGarden() {
  const root = new Group();
  root.name = 'Between Hands · rain garden';
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const geometry = <T extends BufferGeometry>(value: T): T => { geometries.add(value); return value; };
  const material = (color: string, emissive = false) => {
    const value = new MeshStandardMaterial({ color, roughness: TOKENS.material.roughness,
      metalness: TOKENS.material.metalness, ...(emissive ? { emissive: color, emissiveIntensity: .3 } : {}) });
    materials.add(value); return value;
  };
  const clay = material(TOKENS.colors.terracotta);
  const soil = material(TOKENS.colors.soil);
  const stone = material(TOKENS.colors.stone);
  const leaf = material(TOKENS.colors.leaf);
  const growth = material(TOKENS.colors.growth);
  const cream = material(TOKENS.colors.text);
  const rain = material(TOKENS.colors.rain, true);
  const flower = material(TOKENS.colors.flower);
  const sphere = geometry(new SphereGeometry(1, 12, 8));
  const rockGeometry = geometry(new IcosahedronGeometry(1, 1));
  const dummy = new Object3D();
  function mesh(g: BufferGeometry, m: Material, parent = root) {
    const item = new Mesh(g, m); parent.add(item); return item;
  }
  function orb(parent: Group, m: Material, pos: Vec3, size: Vec3) {
    const item = mesh(sphere, m, parent); item.position.set(...pos); item.scale.set(...size); return item;
  }
  const pot = mesh(geometry(new CylinderGeometry(.305, .247, .055, 64)), clay);
  pot.position.y = -.216; pot.scale.z = .72;
  const earth = mesh(geometry(new CylinderGeometry(.291, .291, .009, 64)), soil);
  earth.position.y = -.185; earth.scale.z = .72;
  const rim = mesh(geometry(new TorusGeometry(.299, .008, 8, 64)), clay);
  rim.rotation.x = Math.PI / 2; rim.scale.y = .72; rim.position.y = -.185;
  const foot = mesh(geometry(new CylinderGeometry(.18, .20, .013, 48)), soil);
  foot.position.y = -.25; foot.scale.z = .72;
  // Repeated ceramic inset beads make the rim tactile without new draw calls.
  const beads = new InstancedMesh(sphere, cream, 48);
  for (let i = 0; i < 48; i++) {
    const angle = i / 48 * Math.PI * 2;
    dummy.position.set(Math.cos(angle) * .291, -.18, Math.sin(angle) * .21);
    dummy.scale.setScalar(.0016); dummy.updateMatrix(); beads.setMatrixAt(i, dummy.matrix);
  }
  root.add(beads);
  // Seeded placement is deterministic across reset, captures, and devices.
  const foliage = new InstancedMesh(sphere, leaf, 100);
  const sprouts = new InstancedMesh(sphere, growth, 80);
  const stones = new InstancedMesh(rockGeometry, stone, 28);
  for (let i = 0; i < 100; i++) {
    const a = i * 2.39996;
    const radius = .07 + .19 * Math.sqrt((i + 1) / 100);
    dummy.position.set(Math.cos(a) * radius, -.17 + (i % 5) * .003, Math.sin(a) * radius * .72);
    dummy.rotation.set(.2 * Math.sin(a), a, .5 * Math.cos(a));
    dummy.scale.set(.009, .018 + (i % 4) * .004, .004);
    dummy.updateMatrix(); foliage.setMatrixAt(i, dummy.matrix);
  }
  for (let i = 0; i < 80; i++) {
    const a = i * 2.39996 + .5, radius = .06 + .19 * Math.sqrt((i + 1) / 80);
    dummy.position.set(Math.cos(a) * radius, -.163 + (i % 5) * .003, Math.sin(a) * radius * .72);
    dummy.rotation.set(.3, a, Math.sin(a) * .7); dummy.scale.set(.007, .02, .003);
    dummy.updateMatrix(); sprouts.setMatrixAt(i, dummy.matrix);
  }
  sprouts.visible = false;
  for (let i = 0; i < 28; i++) {
    const a = i * 2.39996, radius = .075 + .18 * ((i * 17 % 29) / 29);
    dummy.position.set(Math.cos(a) * radius, -.18, Math.sin(a) * radius * .72);
    dummy.rotation.set(a, a * .7, 0); dummy.scale.set(.014, .008, .011);
    dummy.updateMatrix(); stones.setMatrixAt(i, dummy.matrix);
  }
  root.add(foliage, sprouts, stones);
  const cloud = new Group(); root.add(cloud);
  orb(cloud, cream, [-.015, 0, 0], [.027,.011,.015]);
  orb(cloud, cream, [.01,.005,0], [.025,.016,.018]);
  orb(cloud, cream, [.025,-.002,.004], [.016,.009,.012]);
  const receiver = new Group(); root.add(receiver);
  const cup = mesh(geometry(new TorusGeometry(.021, .004, 8, 32)), clay, receiver);
  cup.rotation.x = Math.PI / 2;
  const water = orb(receiver, rain, [0,-.001,0], [.019,.002,.019]);
  const bloom = new Group(); receiver.add(bloom); bloom.position.y = .008;
  const stalk = mesh(geometry(new CylinderGeometry(.0015,.002,.042,6)), growth, bloom);
  stalk.position.y = .021;
  const petals = new InstancedMesh(sphere, flower, 7);
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * Math.PI * 2;
    dummy.position.set(Math.cos(a)*.012,.044,Math.sin(a)*.012);
    dummy.rotation.set(0,-a,0); dummy.scale.set(.013,.003,.006);
    dummy.updateMatrix(); petals.setMatrixAt(i,dummy.matrix);
  }
  bloom.add(petals); orb(bloom, cream, [0,.047,0], [.006,.003,.006]);
  const leftAnchor = new Group(), rightAnchor = new Group(); root.add(leftAnchor, rightAnchor);
  const anchorRing = geometry(new TorusGeometry(.016,.0025,8,32));
  mesh(anchorRing,clay,leftAnchor);
  orb(leftAnchor,clay,[0,0,0],[.004,.004,.004]);
  const rightCore = mesh(geometry(new IcosahedronGeometry(.012,0)),rain,rightAnchor);
  rightCore.rotation.z = Math.PI / 4;
  const rightHalo = mesh(geometry(new TorusGeometry(.021,.001,6,32)),rain,rightAnchor);
  rightHalo.rotation.x = .35;
  const pathMaterial = new LineBasicMaterial({ color: TOKENS.colors.rain, transparent: true, opacity: .45 });
  materials.add(pathMaterial);
  const pathGeometry = geometry(new BufferGeometry());
  const positions = new Float32Array(97*3);
  pathGeometry.setAttribute('position',new Float32BufferAttribute(positions,3));
  const pathLine = new Line(pathGeometry,pathMaterial); pathLine.frustumCulled = false; root.add(pathLine);
  const tetherGeometry = geometry(new BufferGeometry());
  tetherGeometry.setAttribute('position',new Float32BufferAttribute(new Float32Array(12),3));
  const tetherMaterial = new LineBasicMaterial({color:TOKENS.colors.muted,transparent:true,opacity:.22});
  materials.add(tetherMaterial);
  const tether = new Line(tetherGeometry,tetherMaterial); tether.frustumCulled = false; root.add(tether);
  const droplets = new InstancedMesh(sphere,rain,42); droplets.frustumCulled = false; root.add(droplets);
  const levelGroup = new Group(); root.add(levelGroup);
  let current: LevelDefinition | undefined;
  let rings: { group: Group; rim: MeshStandardMaterial; shell: MeshStandardMaterial }[] = [];
  let ringMaterials: MeshStandardMaterial[] = [];
  let levelGeometries: BufferGeometry[] = [];
  let points: Vec3[] = [];
  let previous = '';
  let flowEnd = 96;
  let complete = false;
  const direction = new Vector3(), vertical = new Vector3(0,1,0);
  function setLevel(level: LevelDefinition) {
    for (const g of levelGeometries) { g.dispose(); geometries.delete(g); }
    for (const m of ringMaterials) { m.dispose(); materials.delete(m); }
    levelGroup.clear(); levelGeometries = []; ringMaterials = []; rings = [];
    current = level; previous = ''; complete = false; sprouts.visible = false;
    cloud.position.set(...level.source); cloud.position.y += .015;
    receiver.position.set(...level.target);
    for (const rock of level.rocks) {
      const item = mesh(rockGeometry,stone,levelGroup);
      item.position.set(...rock.center); item.scale.setScalar(rock.radius);
      item.rotation.set(.3,.5,.2);
    }
    for (const ring of level.rings) {
      const g = geometry(new TorusGeometry(ring.radius,.001,6,32));
      levelGeometries.push(g);
      const m = material(TOKENS.colors.terracotta,true);
      const shell = material(TOKENS.colors.terracotta,true);
      shell.transparent = true; shell.opacity = .075; shell.depthWrite = false;
      ringMaterials.push(m, shell);
      const group = new Group(); group.position.set(...ring.center); levelGroup.add(group);
      mesh(g,m,group);
      mesh(g,m,group).rotation.x = Math.PI / 2;
      mesh(g,m,group).rotation.y = Math.PI / 2;
      orb(group,shell,[0,0,0],[ring.radius,ring.radius,ring.radius]);
      rings.push({group,rim:m,shell});
    }
  }
  function update(controls: Controls, result: Result, progress: number, elapsed: number) {
    if (!current) return;
    const key = `${controls.left}|${controls.right}`;
    if (key !== previous) {
      points = samplePath(current,controls,96); previous = key;
      // Find the first entry into any padded rock along the same polyline
      // used by puzzle evaluation. Once blocked, no rain appears downstream.
      flowEnd = 96;
      for (let i = 0; i < 96 && i < flowEnd; i++) {
        const a = points[i]!, b = points[i+1]!;
        const dx = b[0]-a[0], dy = b[1]-a[1], dz = b[2]-a[2];
        const length2 = dx*dx + dy*dy + dz*dz;
        for (const rock of current.rocks) {
          const ox = a[0]-rock.center[0], oy = a[1]-rock.center[1], oz = a[2]-rock.center[2];
          const radius = rock.radius + WATER_RADIUS;
          const c = ox*ox + oy*oy + oz*oz - radius*radius;
          if (c <= 0) { flowEnd = Math.min(flowEnd,i); continue; }
          if (length2 === 0) continue;
          const dot = ox*dx + oy*dy + oz*dz;
          const discriminant = dot*dot - length2*c;
          if (discriminant < 0) continue;
          const entry = (-dot-Math.sqrt(discriminant))/length2;
          if (entry >= 0 && entry <= 1) flowEnd = Math.min(flowEnd,i+entry);
        }
      }
      const attr = pathGeometry.getAttribute('position');
      points.forEach((p,i)=>attr.setXYZ(i,...p));
      if (flowEnd < 96) {
        const segment = Math.floor(flowEnd), fraction = flowEnd-segment;
        const a = points[segment]!, b = points[segment+1]!;
        attr.setXYZ(segment+1,a[0]+(b[0]-a[0])*fraction,a[1]+(b[1]-a[1])*fraction,a[2]+(b[2]-a[2])*fraction);
        pathGeometry.setDrawRange(0,segment+2);
      } else pathGeometry.setDrawRange(0,97);
      attr.needsUpdate = true;
      const t = tetherGeometry.getAttribute('position');
      [current.source,controls.left,controls.right,current.target].forEach((p,i)=>t.setXYZ(i,...p)); t.needsUpdate = true;
    }
    leftAnchor.position.set(...controls.left); rightAnchor.position.set(...controls.right);
    const breath = 1 + Math.sin(elapsed * Math.PI * 2 / TOKENS.motion.breathSeconds)*.06;
    leftAnchor.scale.setScalar(breath); rightAnchor.scale.setScalar(breath);
    rings.forEach((ring,i)=>{
      const hit = result.ringsHit[i];
      ring.rim.color.set(hit ? TOKENS.colors.growth : TOKENS.colors.terracotta);
      ring.rim.emissive.copy(ring.rim.color);
      ring.rim.emissiveIntensity = hit ? .65 : .3;
      ring.shell.color.copy(ring.rim.color); ring.shell.emissive.copy(ring.rim.color);
      ring.shell.opacity = hit ? .2 : .075;
    });
    pathMaterial.opacity = result.blocked ? .18 : .45;
    for (let i = 0; i < 42; i++) {
      const t = ((elapsed / TOKENS.motion.rainSeconds + i / 42) % 1) * 96;
      const index = Math.min(95,Math.floor(t));
      const a = points[index]!, b = points[index+1]!;
      dummy.position.set(a[0]+(b[0]-a[0])*(t-index),a[1]+(b[1]-a[1])*(t-index),a[2]+(b[2]-a[2])*(t-index));
      const occluded = t >= flowEnd;
      direction.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]).normalize();
      dummy.quaternion.setFromUnitVectors(vertical,direction);
      dummy.scale.set(.0018,occluded ? 0 : .0036,.0018);
      dummy.updateMatrix(); droplets.setMatrixAt(i,dummy.matrix);
    }
    droplets.instanceMatrix.needsUpdate = true;
    const amount = complete ? 1 : Math.max(.02,Math.min(1,progress));
    bloom.scale.setScalar(.12 + amount*.88);
    water.visible = !result.blocked || complete;
    water.scale.set(.019 * (.6 + amount*.4),.002,.019 * (.6 + amount*.4));
    sprouts.visible = complete;
    cloud.position.y = current.source[1] + .015 + Math.sin(elapsed*.8)*.002;
  }
  return {root,setLevel,update,setCompleted(value: boolean) {complete=value;},dispose() {
    root.removeFromParent(); root.clear();
    for (const g of geometries) g.dispose();
    for (const m of materials) m.dispose();
    for (const instance of [beads,foliage,sprouts,stones,petals,droplets]) instance.dispose();
  }};
}


