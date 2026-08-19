/**
 * use:scrollSpeed={{ factor: 0.35 }}
 *
 * Smoothly reduces scroll speed by `factor`.
 * A factor of 0.35 means each wheel tick moves 35% of normal —
 * requiring roughly 3× more scrolls to cover the same distance.
 * Default factor is 0.35.
 *
 * Uses a rAF loop to lerp toward the accumulated scroll target,
 * giving a fluid, eased feel with natural deceleration.
 *
 * Handles all deltaModes:
 *   0 = pixels (direct multiplication)
 *   1 = lines  (multiply by ~40px per line)
 *   2 = pages  (multiply by window.innerHeight)
 */
export function scrollSpeed(node: HTMLElement, factor: number = 0.35) {
	const lerpSpeed = 0.1;
	let target = window.scrollY;
	let raf: number | null = null;

	function onWheel(e: WheelEvent) {
		if (!e.cancelable) return;
		e.preventDefault();

		let pixels: number;
		switch (e.deltaMode) {
			case 1:
				pixels = e.deltaY * 40 * factor;
				break;
			case 2:
				pixels = e.deltaY * window.innerHeight * factor;
				break;
			default:
				pixels = e.deltaY * factor;
		}

		const maxScroll = Math.max(
			document.documentElement.scrollHeight - window.innerHeight,
			0
		);
		target = Math.max(0, Math.min(target + pixels, maxScroll));

		if (raf === null) {
			raf = requestAnimationFrame(tick);
		}
	}

	function tick() {
		const current = window.scrollY;
		const diff = target - current;

		if (Math.abs(diff) < 0.5) {
			window.scrollTo(0, target);
			raf = null;
			return;
		}

		window.scrollTo(0, current + diff * lerpSpeed);
		raf = requestAnimationFrame(tick);
	}

	node.addEventListener('wheel', onWheel, { passive: false });

	return {
		update(newFactor: number) {
			factor = newFactor;
		},
		destroy() {
			if (raf !== null) {
				cancelAnimationFrame(raf);
				raf = null;
			}
			node.removeEventListener('wheel', onWheel);
		}
	};
}