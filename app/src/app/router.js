import { Router as createRouter } from 'express';
import { createRoutesAndGuards as createAuthRoutesAndGuards } from './auth/router.js';
import { createMonitoringRoutes } from '@pins/inspector-programming-poc-lib/controllers/monitoring.js';
import { buildPostHome, buildViewHome } from './views/home/controller.js';
import { asyncHandler } from '@pins/inspector-programming-poc-lib/util/async-handler.js';
import { buildNotify } from './views/notify/controller.js';
import { buildViewCase } from './views/case/controller.js';
import { buildEntraClientMiddleware } from '@pins/inspector-programming-poc-lib/middleware/entra-client.js';
import { buildViewInspector } from './views/inspector/controller.js';

/**
 * @param {Object} params
 * @param {import('pino').BaseLogger} params.logger
 * @param {import('./config-types.js').Config} params.config
 * @returns {import('express').Router}
 */
export function buildRouter({ logger, config }) {
	const router = createRouter();
	const monitoringRoutes = createMonitoringRoutes({
		config,
		logger
	});
	const { router: authRoutes, guards: authGuards } = createAuthRoutesAndGuards({
		logger,
		config
	});

	router.use('/', monitoringRoutes);
	router.get('/unauthenticated', (req, res) => res.status(401).render('views/errors/401.njk'));

	if (!config.auth.disabled) {
		logger.info('registering auth routes');
		router.use('/auth', authRoutes);

		// all subsequent routes require auth

		// check logged in
		router.use(authGuards.assertIsAuthenticated);
		// check group membership
		router.use(authGuards.assertGroupAccess);
	} else {
		logger.warn('auth disabled; auth routes and guards skipped');
	}

	router.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		next();
	});

	const entraClientMiddleware = buildEntraClientMiddleware({ logger });
	const viewHome = buildViewHome({ logger, config });
	const viewNotify = buildNotify({ logger, config });
	const postHome = buildPostHome({ logger });
	const viewCase = buildViewCase({ logger, config });
	const viewInspector = buildViewInspector({ logger, config });

	router.get('/', asyncHandler(viewHome));
	router.post('/notify', entraClientMiddleware, asyncHandler(viewNotify));
	router.post('/', asyncHandler(postHome));
	router.get('/case/:caseId', asyncHandler(viewCase));
	router.get('/inspector/:inspectorId', asyncHandler(viewInspector));

	return router;
}
