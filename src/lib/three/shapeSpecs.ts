export interface ShapePreset {
	core: number;
	wire: number;
	shellOpacity: number;
	wireScale: number;
	spin: number;
	camZ: number;
}

export const shapeSpecs: Record<string, ShapePreset> = {
	tl: {
		core: 0xd98a1f,
		wire: 0xb5431c,
		shellOpacity: 0.28,
		wireScale: 1.50,
		spin: 0.55,
		camZ: 4.6
	},
	mid: {
		core: 0x9fb37a,
		wire: 0xe0982f,
		shellOpacity: 0.92,
		wireScale: 1.42,
		spin: 0.90,
		camZ: 4.9
	},
	br: {
		core: 0xb5431c,
		wire: 0xe0982f,
		shellOpacity: 0.80,
		wireScale: 1.36,
		spin: 1.15,
		camZ: 4.4
	}
};

/** Per-instance direction multipliers */
export const shapeDir: Record<string, number> = {
	tl: 1,
	mid: -1.5,
	br: 0.7
};

/** Per-instance drift parameters: [xFactor, yFactor, globalFactor] */
export const shapeDrift: Record<string, [number, number, number]> = {
	tl: [-0.16, 0.10, 0.9],
	mid: [0.07, -0.22, 1.35],
	br: [-0.10, 0.16, 0.55]
};

/** Per-instance rotation drift multipliers at scroll */
export const scrollRotY: Record<string, number> = {
	tl: 0.7,
	mid: -1.2,
	br: 1.4
};

export const scrollRotX: Record<string, number> = {
	tl: 0.5,
	mid: -1,
	br: 0.5
};

export const scrollRotZ: Record<string, number> = {
	tl: 0.7,
	mid: 1.6,
	br: 0.7
};

/** Float phases per instance */
export const floatPhase: Record<string, number> = {
	tl: 0,
	mid: 2,
	br: 4
};