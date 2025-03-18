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
			await createEvents(req.entraClient, selectedInspector.id, date, selectedCases);
		} catch (e) {
			logger.error(e);
			return res.status(500).send('Error creating event');
		}

		return res.redirect(`/?inspector=${selectedInspector.id}&message=success`);
	};
}

async function createEvents(client, inspectorId, assignmentDate, selectedCases) {
	const date = new Date(assignmentDate);
	const monday = new Date(date.setDate(date.getDate() - date.getDay() + 1));
	const tuesday = new Date(monday);
	tuesday.setDate(monday.getDate() + 1);
	const wednesday = new Date(monday);
	wednesday.setDate(monday.getDate() + 2);

	const events = selectedCases.flatMap((caseId, index) => {
		const weekOffset = Math.floor(index / 2) * 7;
		const planningDate = new Date(monday);
		planningDate.setDate(monday.getDate() + weekOffset);
		const siteVisitDate = new Date(tuesday);
		siteVisitDate.setDate(tuesday.getDate() + weekOffset);
		const reportDate = new Date(wednesday);
		reportDate.setDate(wednesday.getDate() + weekOffset);

		const planningTime = index % 2 === 0 ? 9 : 13;
		const siteVisitTime = index % 2 === 0 ? 9 : 13;
		const reportTime = index % 2 === 0 ? 9 : 13;

		return [
			client.createEvent(
				inspectorId,
				`Planning Case ID: ${caseId}`,
				new Date(planningDate.setHours(planningTime, 0, 0)),
				240
			),
			client.createEvent(
				inspectorId,
				`Site Visit Case ID: ${caseId}`,
				new Date(siteVisitDate.setHours(siteVisitTime, 0, 0)),
				240
			),
			client.createEvent(inspectorId, `Report Case ID: ${caseId}`, new Date(reportDate.setHours(reportTime, 0, 0)), 240)
		];
	});

	await Promise.all(events);
}
