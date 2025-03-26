import { fetchInspectors } from '@pins/inspector-programming-poc-lib/data/inspectors.js';

/**
 * @param {Object} opts
 * @param {import('pino').BaseLogger} opts.logger
 * @param {import('../config-types.js').Config} opts.config
 * @returns {import('express').Handler}
 */
export function buildViewInspector({ logger, config }) {
	return async (req, res) => {
		logger.info(req.params.inspectorId);

		const inspectors = await fetchInspectors(config);
		const inspector = inspectors.find((i) => i.id === req.params.inspectorId);

		const eventsResponse = await req.entraClient.getEvents(inspector.id);
		const events = Array.isArray(eventsResponse.value) ? eventsResponse.value : [];

		const simplifiedEvents = events.map((event) => {
			const startDateTime = new Date(event.start.dateTime);
			const endDateTime = new Date(event.end.dateTime);
			const durationMinutes = (endDateTime - startDateTime) / (1000 * 60);
			const roundedDurationMinutes = Math.ceil(durationMinutes / 30) * 30;
			const adjustedEndDateTime = new Date(startDateTime.getTime() + roundedDurationMinutes * 60 * 1000);

			return {
				subject: event.subject,
				startDateTime: startDateTime.toISOString(),
				endDateTime: adjustedEndDateTime.toISOString()
			};
		});

		logger.info(simplifiedEvents);
		return res.render('views/inspector/view.njk', {
			inspector,
			events: simplifiedEvents,
			containerClasses: 'pins-container-wide',
			title: 'Inspector Details'
		});
	};
}
