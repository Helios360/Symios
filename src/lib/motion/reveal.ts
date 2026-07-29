/**
 * use:reveal={{threshold:.16}}
 * Fade + translateY(30px) on intersection.
 */
export function reveal(
	node: HTMLElement,
	opts: { threshold?: number } = {}
) {
	const threshold = opts.threshold ?? 0.16;

	// Start hidden
	node.style.opacity = '0';
	node.style.transform = 'translateY(30px)';
	node.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
	node.style.willChange = 'transform, opacity';

	// Safety: force visible after 2.5s
	const safety = setTimeout(() => {
		node.style.opacity = '1';
		node.style.transform = 'translateY(0)';
	}, 2500);

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.style.opacity = '1';
					node.style.transform = 'translateY(0)';
					observer.disconnect();
					clearTimeout(safety);
				}
			}
		},
		{ threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
			clearTimeout(safety);
		}
	};
}