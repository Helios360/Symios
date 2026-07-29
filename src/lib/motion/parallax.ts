import { scrollStore, type ScrollState } from './scrollStore';

/**
 * use:parallax={amount}
 * Translates element vertically as the page scrolls.
 * Negative amount = element "holds back" (moves slower).
 *
 * rate = (rect.top + rect.height/2 - vh/2) / vh
 * translateY = -rate * amount
 */
export function parallax(node: HTMLElement, amount: number) {
	let unsub: (() => void) | null = null;

	node.style.willChange = 'transform';

	function update(scroll: ScrollState) {
		const rect = node.getBoundingClientRect();
		const rate = (rect.top + rect.height / 2 - scroll.vh / 2) / scroll.vh;
		const y = -rate * amount;
		if (isFinite(y)) {
			node.style.transform = `translateY(${y}px)`;
		}
	}

	unsub = scrollStore.subscribe(update);

	return {
		update(newAmount: number) {
			amount = newAmount;
		},
		destroy() {
			if (unsub) unsub();
		}
	};
}