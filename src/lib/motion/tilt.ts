/**
 * use:tilt={{max:3, perspective:800}}
 * Gentle pointer-responsive rotation on an element.
 * Rotates up to ±max degrees on x/y based on pointer proximity to element center.
 * Smooth lerp, respects prefers-reduced-motion.
 * Cooperates with slideIn: reads node.dataset.slideTransform and combines it
 * with its own perspective rotation so both transforms apply on the same element.
 */
export function tilt(
	node: HTMLElement,
	opts: { max?: number; perspective?: number } = {}
) {
	let { max = 3, perspective = 800 } = opts;

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduced) {
		node.style.willChange = 'auto';
		return { destroy() {} };
	}

	let tx = 0;
	let ty = 0;
	let px = 0;
	let py = 0;
	let raf: number | null = null;
	let alive = true;

	node.style.transformStyle = 'preserve-3d';
	node.style.willChange = 'transform';

	function onPointerMove(e: PointerEvent) {
		const rect = node.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		tx = ((e.clientX - cx) / (rect.width / 2)) * max;
		ty = -((e.clientY - cy) / (rect.height / 2)) * max;
		tx = Math.max(-max, Math.min(max, tx));
		ty = Math.max(-max, Math.min(max, ty));
	}

	function tick() {
		if (!alive) return;
		raf = requestAnimationFrame(tick);
		px += (tx - px) * 0.08;
		py += (ty - py) * 0.08;

		if (isFinite(px) && isFinite(py)) {
			const tiltStr = `perspective(${perspective}px) rotateX(${py}deg) rotateY(${px}deg)`;
			// Read slideIn's transform from data attribute and combine
			const base = node.dataset.slideTransform || '';
			if (base) {
				node.style.transform = `${base} ${tiltStr}`;
			} else {
				node.style.transform = tiltStr;
			}
		}
	}

	window.addEventListener('pointermove', onPointerMove);
	raf = requestAnimationFrame(tick);

	return {
		update(newOpts: { max?: number; perspective?: number } = {}) {
			if (newOpts.max !== undefined) max = newOpts.max;
			if (newOpts.perspective !== undefined) perspective = newOpts.perspective;
		},
		destroy() {
			alive = false;
			if (raf !== null) cancelAnimationFrame(raf);
			window.removeEventListener('pointermove', onPointerMove);
			node.style.transform = '';
			node.style.transformStyle = '';
		}
	};
}