import { describe, it, expect } from 'vitest';
import {
	validateEmail,
	validatePassword,
	validatePasswordConfirm,
	validateName,
	validatePhone,
	validateAddress,
	validateCity,
	hasErrors,
	type FieldError
} from '../validation';

describe('validateEmail', () => {
	it('accepte un email valide', () => {
		expect(validateEmail('elias@treguier.fr')).toBeNull();
		expect(validateEmail('  user+tag@example.com ')).toBeNull();
	});

	it('rejette un email vide', () => {
		expect(validateEmail('')).toBe('Email requis');
		expect(validateEmail('   ')).toBe('Email requis');
	});

	it('rejette un email invalide', () => {
		expect(validateEmail('pas-un-email')).toBe('Email invalide');
		expect(validateEmail('a@b')).toBe('Email invalide');
		expect(validateEmail('a b@c.fr')).toBe('Email invalide');
	});

	it('rejette un email trop long', () => {
		expect(validateEmail(`${'a'.repeat(250)}@example.com`)).toBe('Email trop long');
	});
});

describe('validatePassword', () => {
	it('exige un mot de passe non vide', () => {
		expect(validatePassword('')).toBe('Mot de passe requis');
	});

	it('accepte tout mot de passe non vide quand isNew est faux', () => {
		expect(validatePassword('abc')).toBeNull();
	});

	it('valide les règles de création (isNew)', () => {
		expect(validatePassword('abc', { isNew: true })).toBe('Au moins 8 caractères');
		expect(validatePassword('abcdefgh', { isNew: true })).toBe('Doit contenir au moins un chiffre');
		expect(validatePassword('12345678', { isNew: true })).toBe('Doit contenir au moins une lettre');
		expect(validatePassword('motdepasse1', { isNew: true })).toBe('Doit contenir au moins une majuscule');
		expect(validatePassword('Motdepasse1', { isNew: true })).toBe('Doit contenir au moins un caractère spécial');
		expect(validatePassword('Motdepasse1!', { isNew: true })).toBeNull();
	});

	it('rejette un mot de passe trop long', () => {
		expect(validatePassword('a1'.repeat(65), { isNew: true })).toBe('Trop long (max 128)');
	});
});

describe('validatePasswordConfirm', () => {
	it('exige une confirmation', () => {
		expect(validatePasswordConfirm('abc', '')).toBe('Confirmation requise');
	});

	it('signale une non-correspondance', () => {
		expect(validatePasswordConfirm('abc', 'abd')).toBe('Les mots de passe ne correspondent pas');
	});

	it('accepte une confirmation identique', () => {
		expect(validatePasswordConfirm('abc', 'abc')).toBeNull();
	});
});

describe('validateName', () => {
	it('exige un nom quand required', () => {
		expect(validateName('')).toBe('Champ requis');
	});

	it('tolère un nom vide quand optional', () => {
		expect(validateName('  ', { required: false })).toBeNull();
	});

	it('valide les longueurs', () => {
		expect(validateName('A')).toBe('Au moins 2 caractères');
		expect(validateName('A'.repeat(51))).toBe('Trop long (max 50)');
	});

	it('rejette les caractères invalides', () => {
		expect(validateName('Jean@@@')).toBe('Caractères invalides');
	});

	it('accepte un nom valide', () => {
		expect(validateName("Elias Treguier")).toBeNull();
		expect(validateName('José-Anne')).toBeNull();
	});
});

describe('validatePhone', () => {
	it('exige un téléphone quand required', () => {
		expect(validatePhone('')).toBe('Téléphone requis');
		expect(validatePhone('', { required: false })).toBeNull();
	});

	it('accepte les formats français avec séparateurs', () => {
		expect(validatePhone('06 12 34 56 78')).toBeNull();
		expect(validatePhone('+33 6 12 34 56 78')).toBeNull();
	});

	it('rejette un numéro invalide', () => {
		expect(validatePhone('abc')).toBe('Téléphone invalide');
		expect(validatePhone('123')).toBe('Téléphone invalide');
	});
});

describe('validateAddress', () => {
	it('tolère une adresse vide par défaut', () => {
		expect(validateAddress('')).toBeNull();
		expect(validateAddress('', { required: true })).toBe('Adresse requise');
	});

	it('valide les longueurs', () => {
		expect(validateAddress('12')).toBe('Au moins 3 caractères');
		expect(validateAddress('a'.repeat(201))).toBe('Trop long (max 200)');
	});

	it('accepte une adresse valide', () => {
		expect(validateAddress('9 Chemin de la Pierre, 69160 Tassin')).toBeNull();
	});
});

describe('validateCity', () => {
	it('valide les longueurs', () => {
		expect(validateCity('A')).toBe('Au moins 2 caractères');
		expect(validateCity('a'.repeat(101))).toBe('Trop long (max 100)');
	});

	it('rejette les caractères invalides', () => {
		expect(validateCity('Lyon@@')).toBe('Caractères invalides');
	});

	it('accepte une ville valide', () => {
		expect(validateCity('Tassin-la-Demi-Lune')).toBeNull();
	});
});

describe('hasErrors', () => {
	it('renvoie false quand aucune erreur', () => {
		const errors: Record<string, FieldError> = { email: null, name: null };
		expect(hasErrors(errors)).toBe(false);
	});

	it('renvoie true dès qu’une erreur existe', () => {
		expect(hasErrors({ email: null, name: 'Champ requis' })).toBe(true);
	});

	it('renvoie false pour un objet vide', () => {
		expect(hasErrors({})).toBe(false);
	});
});