/**
 * use:float={{amp:6, period:2.8, phase:0}}
 * Gentle vertical bob animation — sinusoidal translateY.
 * Each element gets its own phase so they feel organic.
 * Uses the CSS `translate` property (separate from `transform`)
 * so it never conflicts with slideIn, parallax, or tilt actions.
 * Uses rAF, respects prefers-reduced-motion.
 */
export function float(
	node: HTMLElement,
	opts: { amp?: number; period?: number; phase?: number } = {}
) {
	const { amp = 6, period = 2.8, phase = 0 } = opts;

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduced) {
		node.style.willChange = 'auto';
		return { destroy() {} };
	}

	let raf: number | null = null;
	let start = performance.now();
	let alive = true;

	function tick() {
		if (!alive) return;
		raf = requestAnimationFrame(tick);
		const t = (performance.now() - start) / 1000;
		const y = Math.sin(t * (2 * Math.PI / period) + phase) * amp;
		if (isFinite(y)) {
			node.style.translate = `0 ${y}px`;
		}
	}

	raf = requestAnimationFrame(tick);

	return {
		destroy() {
			alive = false;
			if (raf !== null) cancelAnimationFrame(raf);
			node.style.translate = '';
		}
	};
}