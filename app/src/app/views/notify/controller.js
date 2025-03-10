import { TEMPLATE_IDS } from '#util/notify.js';
import { NotifyClient } from 'notifications-node-client';

const { TestTemplate } = TEMPLATE_IDS;

/**
 * @param {Object} opts
 * @param {import('../config-types.js').Config} opts.config
 * @param {import('pino').BaseLogger} opts.logger
 * @returns {import('express').Handler}
 */
export function buildNotify({ config, logger }) {
	const client = new NotifyClient(config.notify.key);
	const emailAddress = 'email-address-here';

	return async (req, res) => {
		logger.info('sending email');

		const response = await client.sendEmail(TestTemplate, emailAddress, {
			personalisation: {
				first_name: 'John',
				reference: '123456'
			}
		});

		logger.info('email sent', response);

		return res.render('Hello');
	};
}
