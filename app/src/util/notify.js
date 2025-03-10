import { NotifyClient } from 'notifications-node-client';

export function sendEmail({ apiKey, templateId, personalisation, emailAddress }) {
	const client = new NotifyClient(apiKey);

	return client.sendEmail(templateId, emailAddress, {
		personalisation
	});
}

export const TEMPLATE_IDS = {
	TestTemplate: '6dc1cb2f-4ae6-4dfc-8815-22e09601c91c'
};
