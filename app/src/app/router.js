import { Router as createRouter } from 'express';
import { createRoutesAndGuards as createAuthRoutesAndGuards } from './auth/router.js';
import { createMonitoringRoutes } from '@pins/inspector-programming-poc-lib/controllers/monitoring.js';
import { buildViewHome, buildViewMap } from './views/home/controller.js';
import { asyncHandler } from '@pins/inspector-programming-poc-lib/util/async-handler.js';
import { buildNotify } from './views/notify/controller.js';

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

	const viewHome = buildViewHome({ logger });
	const viewMap = buildViewMap({ logger, config });
	const viewNotify = buildNotify({ config, logger });

	router.get('/', asyncHandler(viewHome));
	router.get('/map', asyncHandler(viewMap));
	router.get('/notify', asyncHandler(viewNotify));

	return router;
}
