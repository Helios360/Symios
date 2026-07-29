import { writable } from 'svelte/store';

export type Accent = 'rust' | 'amber' | 'mustard';

export const accentMap: Record<Accent, string> = {
	rust: '#b5431c',
	amber: '#e0982f',
	mustard: '#d98a1f'
};

export interface MotionConfig {
	accent: Accent;
	intensity: number;
	spinSpeed: number;
}

export const motionConfig = writable<MotionConfig>({
	accent: 'rust',
	intensity: 1,
	spinSpeed: 1
});