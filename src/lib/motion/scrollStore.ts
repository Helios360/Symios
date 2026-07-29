import { readable } from 'svelte/store';

export interface ScrollState {
	y: number;
	progress: number;
	vh: number;
}

/**
 * rAF-throttled readable store of scroll position.
 * Always reads real offset via getBoundingClientRect on the root element,
 * with fallback on window.scrollY / scrollingElement.scrollTop.
 */
export const scrollStore = readable<ScrollState>({ y: 0, progress: 0, vh: 0 }, (set) => {
	let raf: number | null = null;
	let prev = { y: 0, vh: 0 };

	function read() {
		const vh = window.innerHeight;
		const rootEl = document.documentElement;
		const y = -rootEl.getBoundingClientRect().top || window.scrollY || rootEl.scrollTop || 0;
		const maxScroll = Math.max(rootEl.scrollHeight - vh, 1);
		const progress = Math.min(y / maxScroll, 1);

		// Only update if something changed
		if (y !== prev.y || vh !== prev.vh) {
			prev = { y, vh };
			set({ y, progress, vh });
		}
		raf = requestAnimationFrame(read);
	}

	raf = requestAnimationFrame(read);

	return () => {
		if (raf !== null) cancelAnimationFrame(raf);
	};
});