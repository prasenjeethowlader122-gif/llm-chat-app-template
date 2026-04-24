import { describe, it, expect } from 'vitest';
import worker from '../src/index';

describe('Laravel Security Auditor Worker', () => {
	it('responds with the frontend HTML', async () => {
		const request = new Request('http://example.com/');
		const env = {
			ASSETS: {
				fetch: (req: Request) => new Response('Laravel Security Auditor'),
			},
		};
		// @ts-ignore
		const response = await worker.fetch(request, env);
		expect(response.status).toBe(200);
		const text = await response.text();
		expect(text).toContain('Laravel Security Auditor');
	});

	it('returns 404 for unknown routes', async () => {
		const request = new Request('http://example.com/api/unknown');
		const env = {};
		// @ts-ignore
		const response = await worker.fetch(request, env);
		expect(response.status).toBe(404);
	});
});
