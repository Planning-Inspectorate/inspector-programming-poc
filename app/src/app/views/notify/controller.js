import { TEMPLATE_IDS } from '#util/notify.js';
import { NotifyClient } from 'notifications-node-client';
import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';

const { TestTemplate } = TEMPLATE_IDS;

/**
 * @param {Object} opts
 * @param {import('../config-types.js').Config} opts.config
 * @returns {import('express').Handler}
 */
export function buildNotify({ config, logger }) {
	const client = new NotifyClient(config.notify.key);

	return async (req, res) => {
		const { inspector, assignmentDate, selectedCases } = req.body;
		const inspectors = await fetchInspectors(config);
		const selectedInspector = inspectors.find((i) => i.id === inspector);
		const selectedCasesFormatted = Array.isArray(selectedCases)
			? selectedCases.join(', ')
			: selectedCases || 'No cases assigned';

		try {
			await client.sendEmail(TestTemplate, selectedInspector.emailAddress, {
				personalisation: {
					inspectorName: selectedInspector.firstName || 'Inspector',
					assignmentDate: assignmentDate || 'No date provided',
					selectedCases: selectedCasesFormatted
				}
			});
		} catch (e) {
			logger.error(`Could not send email to ${selectedInspector.emailAddress}: ${e}`);
			logger.error(e);
			return res.status(500).send('Error sending email');
		}

		try {
			const date = new Date(assignmentDate);
			await req.entraClient.createEvent(selectedInspector.id, 'test event', date, 30);
		} catch (e) {
			logger.error(e);
			return res.status(500).send('Error creating event');
		}

		return res.redirect(`/?inspector=${selectedInspector.id}&message=success`);
	};
}
