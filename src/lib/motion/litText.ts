import { scrollStore, type ScrollState } from './scrollStore';

/**
 * use:litText
 * Each word is wrapped in a <span> that transitions from #c9b894 to #2c2118
 * as the element scrolls into view.
 * p = (vh*.8 - rect.top) / (rect.height + vh*.25)
 * Uses the rAF-throttled scrollStore — no raw scroll events.
 */
export function litText(node: HTMLElement) {
	const text = node.textContent || '';
	const words = text.split(/\s+/);

	node.textContent = '';
	node.style.willChange = 'transform, opacity';

	const spans: HTMLSpanElement[] = words.map((word) => {
		const span = document.createElement('span');
		span.textContent = word;
		span.style.color = '#c9b894';
		span.style.transition = 'color 0.3s ease';
		node.appendChild(span);
		if (word !== words[words.length - 1]) {
			node.appendChild(document.createTextNode(' '));
		}
		return span;
	});

	let unsub: (() => void) | null = null;

	function onScroll(scroll: ScrollState) {
		const vh = scroll.vh;
		const rect = node.getBoundingClientRect();
		const p = Math.min(Math.max((vh * 0.8 - rect.top) / (rect.height + vh * 0.25), 0), 1);
		const colorVal = Math.round(0xc9 * (1 - p) + 0x2c * p);
		const color = `rgb(${colorVal}, ${Math.round(0xb8 * (1 - p) + 0x21 * p)}, ${Math.round(0x94 * (1 - p) + 0x18 * p)})`;
		for (const span of spans) {
			span.style.color = color;
		}
	}

	unsub = scrollStore.subscribe(onScroll);
	// Fire immediately with real viewport values on mount (don't wait for first rAF)
	onScroll({ y: window.scrollY || document.documentElement.scrollTop || 0, progress: 0, vh: window.innerHeight });

	return {
		destroy() {
			if (unsub) unsub();
		}
	};
}