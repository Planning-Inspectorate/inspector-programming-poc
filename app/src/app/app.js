import bodyParser from 'body-parser';
import crypto from 'node:crypto';
import express from 'express';
// import helmet from 'helmet';
import { buildRouter } from './router.js';
import { configureNunjucks } from './nunjucks.js';
import { buildLogRequestsMiddleware } from '@pins/inspector-programming-poc-lib/middleware/log-requests.js';
import {
	buildDefaultErrorHandlerMiddleware,
	notFoundHandler
} from '@pins/inspector-programming-poc-lib/middleware/errors.js';
import { initSessionMiddleware } from '@pins/inspector-programming-poc-lib/util/session.js';

/**
 * @param {import('./config-types.js').Config} config
 * @param {import('pino').Logger} logger
 * @returns {Express}
 */
export function getApp(config, logger) {
	// create an express app, and configure it for our usage
	const app = express();

	const logRequests = buildLogRequestsMiddleware(logger);
	app.use(logRequests);

	// configure body-parser, to populate req.body
	// see https://expressjs.com/en/resources/middleware/body-parser.html
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	const sessionMiddleware = initSessionMiddleware({
		redis: null,
		secure: config.NODE_ENV === 'production',
		secret: config.session.secret
	});
	app.use(sessionMiddleware);

	// Generate the nonce for each request
	app.use((req, res, next) => {
		res.locals.cspNonce = crypto.randomBytes(32).toString('hex');
		next();
	});

	//Secure apps by setting various HTTP headers
	// TODO: fix maps with helmet
	// app.use(helmet());
	// app.use(
	// 	helmet.contentSecurityPolicy({
	// 		directives: {
	// 			// @ts-ignore
	// 			scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
	// 			defaultSrc: ["'self'"],
	// 			'font-src': ["'self'"],
	// 			'img-src': ["'self'"],
	// 			'style-src': ["'self'"]
	// 		}
	// 	})
	// );

	const nunjucksEnvironment = configureNunjucks();
	// Set the express view engine to nunjucks
	// calls to res.render will use nunjucks
	nunjucksEnvironment.express(app);
	app.set('view engine', 'njk');

	// static files
	app.use(express.static(config.staticDir));

	const router = buildRouter({
		config,
		logger
	});
	// register the router, which will define any subpaths
	// any paths not defined will return 404 by default
	app.use('/', router);

	app.use(notFoundHandler);

	const defaultErrorHandler = buildDefaultErrorHandlerMiddleware(logger);
	// catch/handle errors last
	app.use(defaultErrorHandler);

	return app;
}
