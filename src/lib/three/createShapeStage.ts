import type { ShapePreset } from './shapeSpecs';

export interface ShapeStage {
	canvas: HTMLCanvasElement;
	renderer: any;
	scene: any;
	camera: any;
	group: any;
	shellMesh: any;
	wireMesh: any;
	coreMesh: any;
	preset: ShapePreset;
	key: string;
	px: number;
	py: number;
	_ro: ResizeObserver;
}

export function createShapeStage(
	THREE: any,
	canvas: HTMLCanvasElement,
	preset: ShapePreset,
	key: string
): ShapeStage | null {
	if (!THREE) return null;

	const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

	const renderer = new THREE.WebGLRenderer({
		canvas,
		alpha: true,
		antialias: true
	});
	renderer.setPixelRatio(dpr);

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
	camera.position.set(0, 0, preset.camZ);

	// Lights
	scene.add(new THREE.AmbientLight(0xfff1d8, 0.85));
	const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
	keyLight.position.set(3, 4, 5);
	scene.add(keyLight);
	const rimLight = new THREE.DirectionalLight(0xff8a3a, 0.6);
	rimLight.position.set(-4, -2, -3);
	scene.add(rimLight);

	const group = new THREE.Group();
	scene.add(group);

	// 1. Solid shell (core colour)
	const shellMat = new THREE.MeshStandardMaterial({
		color: preset.core,
		roughness: 0.45,
		metalness: 0.15,
		flatShading: true,
		transparent: preset.shellOpacity < 1,
		opacity: preset.shellOpacity
	});
	const shellMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.98, 0), shellMat);
	group.add(shellMesh);

	// 2. Wireframe cage
	const wireMat = new THREE.MeshBasicMaterial({
		color: preset.wire,
		wireframe: true,
		opacity: 0.85,
		transparent: true
	});
	const wireMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(preset.wireScale, 0), wireMat);
	group.add(wireMesh);

	// 3. Inner core (mustard emissive)
	const coreMat = new THREE.MeshStandardMaterial({
		color: 0xd98a1f,
		emissive: 0x3a1c08,
		roughness: 0.4,
		metalness: 0.2,
		flatShading: true
	});
	const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.36, 0), coreMat);
	group.add(coreMesh);

	// Resize handler
	function resize() {
		const w = canvas.clientWidth || 1;
		const h = canvas.clientHeight || 1;
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	}
	const ro = new ResizeObserver(resize);
	ro.observe(canvas);
	resize();

	return {
		canvas,
		renderer,
		scene,
		camera,
		group,
		shellMesh,
		wireMesh,
		coreMesh,
		preset,
		key,
		px: 0,
		py: 0,
		_ro: ro
	};
}