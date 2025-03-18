import { buildInitEntraClient } from '@pins/inspector-programming-poc-lib/graph/cached-entra-client.js';

/**
 * Middleware to provide a controller with the CachedEntraClient
 *
 * @param {Object} opts
 * @param {import('pino').BaseLogger} opts.logger
 * @returns {import('express').RequestHandler}
 */
export function buildEntraClientMiddleware({ logger }) {
	return (req, res, next) => {
		try {
			const initEntraClient = buildInitEntraClient(true, {});
			req.entraClient = initEntraClient(req.session);

			next();
		} catch (error) {
			logger.error('Failed to initialize CachedEntraClient', error);
			res.status(500).send('Internal Server Error');
		}
	};
}
