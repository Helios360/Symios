<script lang="ts">
	import { onMount } from 'svelte';
import { onDestroy } from 'svelte';
	import { scrollStore, type ScrollState } from '$lib/motion/scrollStore';
	import { pointerStore, type PointerState } from '$lib/motion/pointerStore';
	import { shapeSpecs, shapeDir, shapeDrift, scrollRotY, scrollRotX, scrollRotZ, floatPhase } from './shapeSpecs';
	import { createShapeStage, type ShapeStage } from './createShapeStage';

	let stages: ShapeStage[] = [];
	let THREE: any;
	let raf: number | null = null;
	let alive = true;
	let unsubScroll: (() => void) | null = null;
	let unsubPointer: (() => void) | null = null;

	let sy = 0;
	let vh = 1;
	let mx = 0;
	let my = 0;

	// Reduced motion check
	let reducedMotion = false;

	// Canvas refs
	let canvasTl: HTMLCanvasElement;
	let canvasMid: HTMLCanvasElement;
	let canvasBr: HTMLCanvasElement;

	// Container refs
	let containerTl: HTMLDivElement;
	let containerMid: HTMLDivElement;
	let containerBr: HTMLDivElement;

	onMount(() => {
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// Dynamically import THREE
		import('three').then((mod) => {
			THREE = mod;
			initStages();
		});

		unsubScroll = scrollStore.subscribe((s: ScrollState) => {
			sy = s.y;
			vh = s.vh || 1;
		});

		unsubPointer = pointerStore.subscribe((p: PointerState) => {
			mx = p.nx;
			my = p.ny;
		});
	});

	function initStages() {
		if (!THREE) return;

		const specs = [shapeSpecs.tl, shapeSpecs.mid, shapeSpecs.br];
		const canvases = [canvasTl, canvasMid, canvasBr];
		const keys = ['tl', 'mid', 'br'];

		for (let i = 0; i < 3; i++) {
			const stage = createShapeStage(THREE, canvases[i], specs[i], keys[i]);
			if (stage) stages.push(stage);
		}

		if (reducedMotion) {
			// Render one static frame for each
			renderFrame(0);
			return;
		}

		loop();
	}

	function renderFrame(t: number) {
		const progress = vh > 0 ? sy / vh : 0;
		const prog = Math.min(progress * 4, 4); // cap for drift scale

		for (const st of stages) {
			if (!document.contains(st.canvas)) continue;

			const dir = shapeDir[st.key] || 1;
			const drift = shapeDrift[st.key] || [0, 0, 1];
			const phase = floatPhase[st.key] || 0;

			// Pointer lissé
			const effectiveIntensity = 0.55;
			st.px += (mx * dir * effectiveIntensity - st.px) * 0.045;
			st.py += (my * dir * effectiveIntensity - st.py) * 0.045;

			// Group rotations
			const ry = st.px * 0.7 + sy * 0.0026 * (scrollRotY[st.key] || 0.7);
			const rx = st.py * 0.5 + Math.sin(t * 0.25) * 0.12 + sy * 0.0009 * (scrollRotX[st.key] || 0.5);
			const rz = sy * 0.0014 * (scrollRotZ[st.key] || 0.7);

			if (isFinite(ry) && isFinite(rx) && isFinite(rz)) {
				st.group.rotation.y = ry;
				st.group.rotation.x = rx;
				st.group.rotation.z = rz;
			}

			// Float bobbing
			const floatY = Math.sin(t * 0.55 + phase) * 0.1;
			if (isFinite(floatY)) {
				st.group.position.y = floatY;
			}

			// Pulse scale
			const pulse = 1 + Math.sin(t * 0.8 + (st.key === 'br' ? 1.4 : 0)) * 0.022;
			if (isFinite(pulse)) {
				st.group.scale.set(pulse, pulse, pulse);
			}

			// Mesh self-rotation
			const sp = st.preset.spin;
			if (isFinite(sp)) {
				st.shellMesh.rotation.x += 0.003 * sp;
				st.shellMesh.rotation.y += 0.005 * sp;

				st.wireMesh.rotation.x -= 0.0016 * sp;
				st.wireMesh.rotation.y += 0.003 * sp;

				st.coreMesh.rotation.x += 0.006 * sp;
				st.coreMesh.rotation.y -= 0.004 * sp;
			}

			st.renderer.render(st.scene, st.camera);
		}

		// Container drift (parallax on the shape divs themselves)
		applyContainerDrift(prog);
	}

	function applyContainerDrift(prog: number) {
		const containers: Record<string, HTMLDivElement> = {
			tl: containerTl,
			mid: containerMid,
			br: containerBr
		};

		for (const [key, el] of Object.entries(containers)) {
			if (!el) continue;
			const drift = shapeDrift[key] || [0, 0, 1];

			const x = prog * drift[0] * 340 + mx * 30 * drift[2] * 0.55;
			const y = prog * drift[1] * 300 + my * 26 * drift[2] * 0.55;
			const rot = prog * drift[1] * 16;
			const scale = 1 + Math.sin(Math.min(prog, 4) * 0.8) * 0.09 * drift[2];

			if (isFinite(x) && isFinite(y) && isFinite(rot) && isFinite(scale)) {
				el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${scale})`;
			}
		}
	}

	function loop() {
		if (!alive) return;
		raf = requestAnimationFrame(loop);

		if (document.hidden) {
			// Still render one frame but don't advance time
			renderFrame(performance.now() / 1000);
			return;
		}

		const t = performance.now() / 1000;
		renderFrame(t);
	}

	function cleanup() {
		alive = false;
		if (raf !== null) cancelAnimationFrame(raf);
		if (unsubScroll) unsubScroll();
		if (unsubPointer) unsubPointer();
		for (const st of stages) {
			try {
				st._ro.disconnect();
				st.renderer.dispose();
			} catch (_) {}
		}
		stages = [];
	}

	onDestroy(cleanup);
</script>

<!-- Container dérive (parallaxe propre des conteneurs) -->
<div
	bind:this={containerTl}
	class="shape-field shape-tl"
	aria-hidden="true"
>
	<canvas bind:this={canvasTl}></canvas>
</div>

<div
	bind:this={containerMid}
	class="shape-field shape-mid"
	aria-hidden="true"
>
	<canvas bind:this={canvasMid}></canvas>
</div>

<div
	bind:this={containerBr}
	class="shape-field shape-br"
	aria-hidden="true"
>
	<canvas bind:this={canvasBr}></canvas>
</div>

<style>
	.shape-field {
		position: fixed;
		pointer-events: none;
		will-change: transform;
		overflow: hidden;
	}

	.shape-field canvas {
		display: block;
		width: 100%;
		height: 100%;
	}

	.shape-tl {
		left: 0;
		top: -9vw;
		width: 33vw;
		height: 44vw;
		z-index: 0;
		opacity: 0.62;
	}

	.shape-mid {
		right: 0;
		top: 10vh;
		width: 23vw;
		height: 30vw;
		z-index: 2;
		opacity: 0.9;
	}

	.shape-br {
		right: 0;
		bottom: -20vw;
		width: 49vw;
		height: 62vw;
		z-index: 40;
		opacity: 1;
	}

	/* ── Hide shapes entirely on narrow screens ── */
	@media (max-width: 850px) {
		.shape-field {
			display: none;
		}
	}
</style>