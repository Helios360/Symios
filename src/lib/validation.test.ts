import { describe, it, expect } from 'vitest';
import {
	validateEmail,
	validatePassword,
	validatePasswordConfirm,
	validateName,
	validatePhone
} from './validation';

describe('validateEmail', () => {
	it('accepts a valid email', () => {
		expect(validateEmail('user@example.com')).toBeNull();
	});
	it('rejects empty string', () => {
		expect(validateEmail('')).toBe('Email requis');
	});
	it('rejects missing @', () => {
		expect(validateEmail('notanemail')).toBe('Email invalide');
	});
	it('rejects too long email', () => {
		expect(validateEmail('a'.repeat(250) + '@b.co')).toBe('Email trop long');
	});
});

describe('validatePassword', () => {
	it('accepts a valid password (basic check)', () => {
		expect(validatePassword('abc12345')).toBeNull();
	});
	it('rejects empty', () => {
		expect(validatePassword('')).toBe('Mot de passe requis');
	});
});

describe('validatePasswordConfirm', () => {
	it('passes when passwords match', () => {
		expect(validatePasswordConfirm('abc123', 'abc123')).toBeNull();
	});
	it('fails when they differ', () => {
		expect(validatePasswordConfirm('abc123', 'xyz789')).toBe('Les mots de passe ne correspondent pas');
	});
});

describe('validateName', () => {
	it('accepts a valid name', () => {
		expect(validateName('Elias')).toBeNull();
	});
	it('rejects empty when required', () => {
		expect(validateName('')).toBe('Champ requis');
	});
	it('accepts French characters', () => {
		expect(validateName('François')).toBeNull();
	});
});

describe('validatePhone', () => {
	it('accepts a French mobile number', () => {
		expect(validatePhone('0628783585')).toBeNull();
	});
	it('accepts with formatting', () => {
		expect(validatePhone('06 28 78 35 85')).toBeNull();
	});
	it('rejects empty when required', () => {
		expect(validatePhone('')).toBe('Téléphone requis');
	});
});