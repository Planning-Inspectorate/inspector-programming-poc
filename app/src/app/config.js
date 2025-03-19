import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'url';

/**
 * The environment names
 *
 * @type {Readonly<{PROD: string, DEV: string, TEST: string, TRAINING: string}>}
 */
export const ENVIRONMENT_NAME = Object.freeze({
	DEV: 'dev',
	TEST: 'test',
	TRAINING: 'training',
	PROD: 'prod'
});

// cache the config
/** @type {undefined|Config} */
let config;

/**
 * @returns {Config}
 */
export function loadConfig() {
	if (config) {
		return config;
	}
	// load configuration from .env file into process.env
	dotenv.config();

	// get values from the environment
	const {
		APP_HOSTNAME,
		AUTH_CLIENT_ID,
		AUTH_CLIENT_SECRET,
		AUTH_DISABLED,
		AUTH_GROUP_APPLICATION_ACCESS,
		AUTH_TENANT_ID,
		ENTRA_GROUP_CACHE_TTL,
		GIT_SHA,
		GOV_NOTIFY_API_KEY,
		LOG_LEVEL,
		PORT,
		MAPS_API_KEY,
		MAPS_API_SECRET,
		NODE_ENV,
		REDIS_CONNECTION_STRING,
		SESSION_SECRET,
		USER_EMAIL_0,
		USER_EMAIL_1,
		USER_EMAIL_2,
		USER_EMAIL_3,
		USER_EMAIL_4,
		USER_ID_0,
		USER_ID_1,
		USER_ID_2,
		USER_ID_3,
		USER_ID_4
	} = process.env;

	const buildConfig = loadBuildConfig();

	let httpPort = 8080;
	if (PORT) {
		// PORT is set by App Service
		const port = parseInt(PORT);
		if (isNaN(port)) {
			throw new Error('PORT must be an integer');
		}
		httpPort = port;
	}

	const isProduction = NODE_ENV === 'production';

	const authDisabled = AUTH_DISABLED === 'true' && !isProduction;
	if (!authDisabled) {
		const props = {
			AUTH_CLIENT_ID,
			AUTH_CLIENT_SECRET,
			AUTH_GROUP_APPLICATION_ACCESS,
			AUTH_TENANT_ID
		};
		for (const [k, v] of Object.entries(props)) {
			if (v === undefined || v === '') {
				throw new Error(k + ' must be a non-empty string');
			}
		}
	}

	const protocol = APP_HOSTNAME?.startsWith('localhost') ? 'http://' : 'https://';

	config = {
		appHostname: APP_HOSTNAME,
		auth: {
			authority: `https://login.microsoftonline.com/${AUTH_TENANT_ID}`,
			clientId: AUTH_CLIENT_ID,
			clientSecret: AUTH_CLIENT_SECRET,
			disabled: authDisabled,
			groups: {
				applicationAccess: AUTH_GROUP_APPLICATION_ACCESS
			},
			redirectUri: `${protocol}${APP_HOSTNAME}/auth/redirect`,
			signoutUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/logout'
		},
		entra: {
			// in minutes
			cacheTtl: parseInt(ENTRA_GROUP_CACHE_TTL || 15),
			groupIds: {}
		},
		gitSha: GIT_SHA,
		inspectors: [
			{ id: USER_ID_0, emailAddress: USER_EMAIL_0 },
			{ id: USER_ID_1, emailAddress: USER_EMAIL_1 },
			{ id: USER_ID_2, emailAddress: USER_EMAIL_2 },
			{ id: USER_ID_3, emailAddress: USER_EMAIL_3 },
			{ id: USER_ID_4, emailAddress: USER_EMAIL_4 }
		],
		// the log level to use
		logLevel: LOG_LEVEL || 'info',
		maps: {
			key: MAPS_API_KEY,
			secret: MAPS_API_SECRET
		},
		notify: {
			key: GOV_NOTIFY_API_KEY
		},
		NODE_ENV: NODE_ENV || 'development',
		// the HTTP port to listen on
		httpPort: httpPort,
		session: {
			redisPrefix: 'app:',
			redis: REDIS_CONNECTION_STRING,
			secret: SESSION_SECRET
		},
		// the src directory
		srcDir: buildConfig.srcDir,
		// the static directory to serve assets from (images, css, etc..)
		staticDir: buildConfig.staticDir
	};

	return config;
}

/**
 * Config required for the build script
 * @returns {{srcDir: string, staticDir: string}}
 */
export function loadBuildConfig() {
	// get the file path for the directory this file is in
	const dirname = path.dirname(fileURLToPath(import.meta.url));
	// get the file path for the src directory
	const srcDir = path.join(dirname, '..');
	// get the file path for the .static directory
	const staticDir = path.join(srcDir, '.static');

	return {
		srcDir,
		staticDir
	};
}

/**
 * Load the environment the application is running in. The value should be
 * one of the ENVIRONMENT_NAME values defined at the top of the file, and matches
 * the environment variable in the infrastructure code.
 *
 * @returns {string}
 */
export function loadEnvironmentConfig() {
	// load configuration from .env file into process.env
	dotenv.config();

	// get values from the environment
	const { ENVIRONMENT } = process.env;

	if (!ENVIRONMENT) {
		throw new Error('ENVIRONMENT is required');
	}

	if (!Object.values(ENVIRONMENT_NAME).includes(ENVIRONMENT)) {
		throw new Error(`ENVIRONMENT must be one of: ${Object.values(ENVIRONMENT_NAME)}`);
	}

	return ENVIRONMENT;
}
