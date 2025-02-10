import { getApp } from './app/app.js';
import { loadConfig } from './app/config.js';
import { initLogger } from '@pins/inspector-programming-poc-lib/util/logger.js';

const config = loadConfig();
const logger = initLogger(config);

const app = getApp(config, logger);

// Trust proxy, because our application is behind Front Door
// required for secure session cookies
// see https://expressjs.com/en/resources/middleware/session.html#cookiesecure
app.set('trust proxy', true);

// set the HTTP port to use from loaded config
app.set('http-port', config.httpPort);

// start the app, listening for incoming requests on the given port
app.listen(app.get('http-port'), () => {
	logger.info(`Server is running at http://localhost:${app.get('http-port')} in ${app.get('env')} mode`);
});
