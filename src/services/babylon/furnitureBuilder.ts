import type { DesignData } from '@/types';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  DirectionalLight,
  ShadowGenerator,
  Color3,
  Color4,
  MeshBuilder,
  StandardMaterial,
  type AbstractMesh,
} from '@babylonjs/core';

export interface BabylonHandles {
  engine: Engine;
  scene: Scene;
}

/** Parse a dimensions string like "H 85 x W 52 x D 55 cm" into metres. */
export function parseDimensions(input: string): { h: number; w: number; d: number } {
  const text = (input || '').toLowerCase();

  const grab = (label: string): number | null => {
    const m = text.match(new RegExp(`${label}\\D*?(\\d+(?:\\.\\d+)?)`));
    return m ? parseFloat(m[1]) : null;
  };

  let h = grab('h');
  let w = grab('w');
  let d = grab('d');

  if (h === null || w === null || d === null) {
    const nums = (text.match(/(\d+(?:\.\d+)?)/g) || []).map(Number);
    const [a, b, c] = nums;
    h = h ?? a ?? 90;
    w = w ?? b ?? 120;
    d = d ?? c ?? 60;
  }

  // Normalise: assume centimetres if values are large, otherwise treat as metres.
  const norm = (v: number) => (v > 20 ? v / 100 : v);
  return { h: Math.max(0.2, norm(h)), w: Math.max(0.2, norm(w)), d: Math.max(0.2, norm(d)) };
}

/** Resolve a base albedo colour from the material + colour prompt keywords. */
export function resolveColor(material: string, color: string): Color3 {
  const m = (material || '').toLowerCase();
  const c = (color || '').toLowerCase();
  const hay = `${c} ${m}`;

  const table: Array<[RegExp, [number, number, number]]> = [
    [/matte black|black|hitam/, [0.12, 0.12, 0.13]],
    [/white|putih/, [0.92, 0.92, 0.93]],
    [/walnut/, [0.3, 0.18, 0.1]],
    [/mahogany/, [0.4, 0.15, 0.12]],
    [/bamboo/, [0.82, 0.7, 0.45]],
    [/natural oak|oak/, [0.73, 0.55, 0.33]],
    [/metal|steel|iron|aluminium|aluminum|besi/, [0.7, 0.72, 0.75]],
    [/glass|kaca/, [0.8, 0.88, 0.92]],
    [/rattan|wicker/, [0.78, 0.66, 0.42]],
    [/teak|wood|kayu|pine|ash|maple/, [0.55, 0.36, 0.2]],
  ];

  for (const [re, rgb] of table) {
    if (re.test(hay)) return new Color3(rgb[0], rgb[1], rgb[2]);
  }
  return new Color3(0.55, 0.36, 0.2);
}

type Dim = ReturnType<typeof parseDimensions>;

function makeMaterial(scene: Scene, color: Color3, label: string): StandardMaterial {
  const mat = new StandardMaterial(`mat_${label}`, scene);
  mat.diffuseColor = color;
  mat.specularColor = color.scale(0.25);
  mat.specularPower = 48;
  return mat;
}

function makeBox(
  scene: Scene,
  mat: StandardMaterial,
  sg: ShadowGenerator,
  sx: number,
  sy: number,
  sz: number,
  cx: number,
  cy: number,
  cz: number
): AbstractMesh {
  const mesh = MeshBuilder.CreateBox('b', { width: sx, height: sy, depth: sz }, scene);
  mesh.position.set(cx, cy, cz);
  mesh.material = mat;
  mesh.receiveShadows = true;
  sg.addShadowCaster(mesh);
  return mesh;
}

function makeLegPair(
  scene: Scene,
  mat: StandardMaterial,
  sg: ShadowGenerator,
  w: number,
  d: number,
  legH: number,
  legT: number,
  yBase: number,
  insetX: number,
  insetZ: number
) {
  const xs = [w / 2 - insetX, -(w / 2 - insetX)];
  const zs = [d / 2 - insetZ, -(d / 2 - insetZ)];
  for (const x of xs) {
    for (const z of zs) {
      makeBox(scene, mat, sg, legT, legH, legT, x, yBase + legH / 2, z);
    }
  }
}

function buildByType(
  scene: Scene,
  mat: StandardMaterial,
  sg: ShadowGenerator,
  type: string,
  dim: Dim
) {
  const { h, w, d } = dim;
  const t = Math.max(0.04, h * 0.06); // top thickness
  const inset = Math.max(0.05, Math.min(w, d) * 0.12);

  const chairLike = /chair|sofa|bench|stool|seat/.test(type);
  const bedLike = /bed/.test(type);
  const flatTop = /table|desk|cabinet|shelf|drawer|counter|console/.test(type) || !(chairLike || bedLike);

  if (chairLike || flatTop) {
    const legH = Math.max(0.2, h * 0.45);
    makeLegPair(scene, mat, sg, w, d, legH, Math.max(0.04, Math.min(w, d) * 0.06), 0, inset, inset);
    const topY = legH + t / 2;
    makeBox(scene, mat, sg, w, t, d, 0, topY, 0);

    if (chairLike) {
      const backH = Math.max(0.3, h - legH - t);
      const backT = Math.max(0.04, Math.min(w, d) * 0.05);
      makeBox(scene, mat, sg, w, backH, backT, 0, legH + t + backH / 2, -d / 2 + backT / 2);
    }
  }

  if (bedLike) {
    const legH = Math.max(0.15, h * 0.4);
    makeLegPair(scene, mat, sg, w, d, legH, 0.06, 0, inset, inset);
    const mattressH = Math.max(0.18, h * 0.18);
    makeBox(scene, mat, sg, w, mattressH, d, 0, legH + mattressH / 2, 0);
    const headH = Math.max(0.4, h - legH - mattressH);
    const headT = 0.08;
    makeBox(scene, mat, sg, w, headH, headT, 0, legH + mattressH + headH / 2, -d / 2 + headT / 2);
  }

  if (/shelf|cabinet|bookcase/.test(type)) {
    const legH = Math.max(0.15, h * 0.4);
    const innerH = h - legH;
    const shelves = Math.max(2, Math.round(innerH / 0.4));
    for (let i = 1; i < shelves; i++) {
      const sy = legH + (innerH * i) / shelves;
      makeBox(scene, mat, sg, w * 0.96, 0.04, d * 0.96, 0, sy, 0);
    }
  }
}

function buildLamp(
  scene: Scene,
  mat: StandardMaterial,
  sg: ShadowGenerator,
  dim: Dim
) {
  const { h, w, d } = dim;
  const baseD = Math.max(0.12, Math.min(w, d) * 0.6);
  const base = MeshBuilder.CreateCylinder(
    'lampBase',
    { diameter: baseD, height: 0.08, tessellation: 32 },
    scene
  );
  base.position.set(0, 0.04, 0);
  base.material = mat;
  base.receiveShadows = true;
  sg.addShadowCaster(base);

  const poleH = Math.max(0.4, h - 0.4);
  const pole = MeshBuilder.CreateCylinder(
    'lampPole',
    { diameter: 0.05, height: poleH, tessellation: 16 },
    scene
  );
  pole.position.set(0, 0.08 + poleH / 2, 0);
  pole.material = mat;
  sg.addShadowCaster(pole);

  const shadeH = Math.max(0.15, h * 0.22);
  const shade = MeshBuilder.CreateCylinder(
    'lampShade',
    { diameterTop: baseD * 0.9, diameterBottom: baseD * 1.3, height: shadeH, tessellation: 32 },
    scene
  );
  shade.position.set(0, h - shadeH / 2, 0);
  shade.material = mat;
  sg.addShadowCaster(shade);
}

/**
 * Build a live, rotatable 3D furniture scene from structured design data.
 * Pure Babylon — runs fully offline in the browser, no external image model.
 */
export function buildFurnitureScene(canvas: HTMLCanvasElement, data: DesignData): BabylonHandles {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.97, 0.98, 0.99, 1);

  const dim = parseDimensions(data.dimensions);
  const target = new Vector3(0, dim.h * 0.5, 0);
  const radius = Math.max(dim.w, dim.d, dim.h) * 2.6 + 1.2;

  const camera = new ArcRotateCamera('camera', -Math.PI / 2.2, Math.PI / 2.6, radius, target, scene);
  camera.wheelPrecision = 24;
  camera.lowerRadiusLimit = radius * 0.3;
  camera.upperRadiusLimit = radius * 3;
  camera.minZ = 0.05;
  camera.attachControl(true);

  const hemi = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
  hemi.intensity = 0.9;
  hemi.groundColor = new Color3(0.92, 0.92, 0.92);

  const dir = new DirectionalLight('dir', new Vector3(-0.5, -1, -0.5), scene);
  dir.position = new Vector3(20, 40, 20);
  dir.intensity = 0.95;

  const sg = new ShadowGenerator(1024, dir);
  sg.useBlurExponentialShadowMap = true;
  sg.blurKernel = 32;

  const floor = MeshBuilder.CreateBox('floor', { width: 6, height: 0.05, depth: 6 }, scene);
  floor.position.y = -0.025;
  const floorMat = new StandardMaterial('floorMat', scene);
  floorMat.diffuseColor = new Color3(0.91, 0.92, 0.93);
  floorMat.specularColor = new Color3(0.1, 0.1, 0.1);
  floor.material = floorMat;
  floor.receiveShadows = true;

  const color = resolveColor(data.material, '');
  const mat = makeMaterial(scene, color, 'furniture');

  const type = data.name || '';
  if (/lamp|lighting|lampu/.test(type.toLowerCase())) {
    buildLamp(scene, mat, sg, dim);
  } else {
    buildByType(scene, mat, sg, type.toLowerCase(), dim);
  }

  engine.runRenderLoop(() => {
    if (scene.isReady()) scene.render();
  });

  return { engine, scene };
}
