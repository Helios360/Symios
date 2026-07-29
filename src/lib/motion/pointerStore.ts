import { readable } from 'svelte/store';

export interface PointerState {
	nx: number;
	ny: number;
}

/**
 * rAF-throttled readable store of normalised pointer position.
 * nx, ny range from -0.5 (left/top) to +0.5 (right/bottom).
 */
export const pointerStore = readable<PointerState>({ nx: 0, ny: 0 }, (set) => {
	let raf: number | null = null;
	let tx = 0;
	let ty = 0;

	function onPointerMove(e: PointerEvent) {
		tx = e.clientX / window.innerWidth - 0.5;
		ty = e.clientY / window.innerHeight - 0.5;
	}

	function tick() {
		set({ nx: tx, ny: ty });
		raf = requestAnimationFrame(tick);
	}

	window.addEventListener('pointermove', onPointerMove);
	raf = requestAnimationFrame(tick);

	return () => {
		if (raf !== null) cancelAnimationFrame(raf);
		window.removeEventListener('pointermove', onPointerMove);
	};
});