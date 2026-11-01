import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Page ressources désactivée — les posts épinglés arriveront ici plus tard.
export const load: PageServerLoad = () => {
	throw redirect(303, '/blog');
};