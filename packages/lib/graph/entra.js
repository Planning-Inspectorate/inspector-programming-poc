import { URL } from 'node:url';

const PER_PAGE = 500; // max 999 per page
const MAX_PAGES = 10; // max 5000 entries

// odata reference properties and values
export const ODATA = Object.freeze({
	NEXT_LINK: '@odate.nextLink',
	TYPE: '@odata.type',
	GROUP_TYPE: '#microsoft.graph.group',
	USER_TYPE: '#microsoft.graph.user'
});

export class EntraClient {
	/** @type {import('@microsoft/microsoft-graph-client').Client} */
	#client;

	/**
	 * @param {import('@microsoft/microsoft-graph-client').Client} client
	 */
	constructor(client) {
		this.#client = client;
	}

	/**
	 * Fetch all group members - direct and indirect - of an Entra group, up to a maximum of 5000
	 *
	 * @param {string} groupId
	 * @returns {Promise<import('./types.js').GroupMember[]>}
	 */
	async listAllGroupMembers(groupId) {
		const listMembers = this.#client
			.api(`groups/${groupId}/transitiveMembers`)
			.select(['id', 'displayName'])
			.top(PER_PAGE);

		const members = [];
		for (let i = 0; i < MAX_PAGES; i++) {
			const res = await listMembers.get();
			members.push(...res.value.filter((v) => v[ODATA.TYPE] === ODATA.USER_TYPE));

			const nextLink = res[ODATA.NEXT_LINK];
			if (!nextLink) {
				break;
			}
			// make the next request with the skipToken value to fetch the next page
			const token = EntraClient.extractSkipToken(nextLink);
			listMembers.skipToken(token);
		}
		return members;
	}

	/**
	 * Create an event in a users calendar
	 *
	 * @param {string} userId
	 * @param {string} subject
	 * @param {string} body
	 * @param {Date} start
	 * @param {number} lengthMins
	 * @returns {Promise<import('@microsoft/microsoft-graph-client').ClientResponse>}
	 */
	async createEvent(userId, subject, body, start, lengthMins) {
		const event = {
			subject,
			body: {
				contentType: 'text',
				content: body
			},
			start: {
				dateTime: start,
				timeZone: 'UTC'
			},
			end: {
				dateTime: new Date(start.getTime() + lengthMins * 60000),
				timeZone: 'UTC'
			}
		};
		return this.#client.api(`/users/${userId}/events`).post(event);
	}

	async getEvents(userId) {
		const startDate = new Date();
		startDate.setHours(0, 0, 0, 0);
		const endDate = new Date();
		endDate.setHours(23, 59, 59, 999);
		endDate.setDate(endDate.getDate() + 90);

		return this.#client
			.api(
				`/users/${userId}/calendarView?startDateTime=${startDate.toISOString()}&endDateTime=${endDate.toISOString()}&&top=999&$select=subject,start,end`
			)
			.header('Prefer', 'outlook.timezone="Europe/London"')
			.get();
	}

	/**
	 * Get a skip token out of an '@odata.nextLink' value
	 *
	 * @param {string} link
	 * @returns {string|undefined}
	 */
	static extractSkipToken(link) {
		const url = URL.parse(link);
		if (!url) {
			return undefined;
		}
		for (const [k, v] of url.searchParams) {
			if (k.toLowerCase() === '$skiptoken') {
				return v;
			}
		}
	}
}
