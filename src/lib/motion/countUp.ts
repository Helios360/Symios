/**
 * use:countUp={{to:12, suffix:'j'}}
 * Animates from 0 to `to` over 1.1s cubic-out on first intersection.
 */
export function countUp(
	node: HTMLElement,
	opts: { to: number; suffix?: string }
) {
	const { to, suffix = '' } = opts;
	let animated = false;

	function animate() {
		if (animated) return;
		animated = true;
		observer.disconnect();

		const duration = 1100;
		const start = performance.now();

		function tick(now: number) {
			const elapsed = now - start;
			const t = Math.min(elapsed / duration, 1);
			// cubic-out
			const ease = 1 - (1 - t) ** 3;
			const current = Math.round(ease * to);
			node.textContent = `${current}${suffix}`;
			if (t < 1) {
				requestAnimationFrame(tick);
			}
		}
		requestAnimationFrame(tick);
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					animate();
				}
			}
		},
		{ threshold: 0.3 }
	);

	// Store original for reference
	const originalText = node.textContent || '';
	if (originalText) {
		// We'll override with the counted version
		node.textContent = `0${suffix}`;
	}

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}