import { scrollStore, type ScrollState } from './scrollStore';

export type SlideDir = 'l' | 'r' | 'u' | 'd';

/**
 * use:slideIn={{dir:'l', dist:110}}
 * Elements slide in from dir on scroll.
 * Once fully in view (p >= 1), stops writing transform so other
 * actions (float, tilt) can take over without conflict.
 * Uses the rAF-throttled scrollStore — no raw scroll events.
 */
export function slideIn(
	node: HTMLElement,
	opts: { dir: SlideDir; dist: number }
) {
	const { dir, dist } = opts;
	const rotMap: Record<SlideDir, number> = { l: -5, r: 5, u: 5, d: -5 };
	const initialRot = rotMap[dir];
	const translateMap: Record<SlideDir, [number, number]> = {
		l: [-1, 0],
		r: [1, 0],
		u: [0, -1],
		d: [0, 1]
	};
	const [dx, dy] = translateMap[dir];

	let unsub: (() => void) | null = null;
	let settled = false;

	function onScroll(scroll: ScrollState) {
		const vh = scroll.vh;
		const rect = node.getBoundingClientRect();
		const rawP = (vh * 0.92 - rect.top) / (vh * 0.55);
		const p = Math.min(Math.max(rawP, 0), 1);
		const ease = 1 - (1 - p) ** 3;

		const opacity = Math.min(p * 1.3, 1);
		node.style.opacity = `${opacity}`;

		// Once fully in view, stop overriding transform so float/tilt can take over
		if (rawP >= 1 && settled) return;
		if (rawP >= 1) {
			settled = true;
			node.style.transform = '';
			node.style.willChange = '';
			delete node.dataset.slideTransform;
			return;
		}

		const tX = dx * dist * (1 - ease);
		const tY = dy * dist * (1 - ease);
		const rot = initialRot * (1 - ease);

		if (isFinite(tX) && isFinite(tY) && isFinite(rot)) {
			const transform = `translate3d(${tX}px, ${tY}px, 0) rotate(${rot}deg)`;
			node.style.transform = transform;
			// Store for tilt action to read and combine
			node.dataset.slideTransform = transform;
		}
	}

	// Initial state: hidden
	node.style.opacity = '0';
	const initialTransform = `translate3d(${dx * dist}px, ${dy * dist}px, 0) rotate(${initialRot}deg)`;
	node.style.transform = initialTransform;
	node.dataset.slideTransform = initialTransform;
	node.style.willChange = 'transform, opacity';

	unsub = scrollStore.subscribe(onScroll);

	return {
		destroy() {
			if (unsub) unsub();
		}
	};
}