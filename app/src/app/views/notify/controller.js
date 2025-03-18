import { TEMPLATE_IDS } from '#util/notify.js';
import { NotifyClient } from 'notifications-node-client';
import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';

const { TestTemplate } = TEMPLATE_IDS;

/**
 * @param {Object} opts
 * @param {import('../config-types.js').Config} opts.config
 * @returns {import('express').Handler}
 */
export function buildNotify({ config }) {
	const client = new NotifyClient(config.notify.key);

	return async (req, res) => {
		const { inspector, assignmentDate, selectedCases } = req.body;
		const inspectors = await fetchInspectors(10);
		const inspectorX = inspectors.find((i) => i.id === inspector);
		const selectedCasesFormatted = Array.isArray(selectedCases)
			? selectedCases.join(', ')
			: selectedCases || 'No cases assigned';

		try {
			await client.sendEmail(TestTemplate, inspectorX.emailAddress, {
				personalisation: {
					inspectorName: inspectorX.firstName || 'Inspector',
					assignmentDate: assignmentDate || 'No date provided',
					selectedCases: selectedCasesFormatted
				}
			});
		} catch {
			res.status(500).send('Error sending email');
		}
	};
}
