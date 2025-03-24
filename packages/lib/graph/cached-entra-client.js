import { Client } from '@microsoft/microsoft-graph-client';
import { EntraClient } from './entra.js';

const CACHE_PREFIX = 'entra-group__';

/**
 * @typedef {import('../util/map-cache.js').MapCache} MapCache
 */

/**
 * @param {boolean} authEnabled
 * @param {MapCache} cache
 * @returns {import('./types.js').InitEntraClient}
 */
export function buildInitEntraClient(authEnabled, cache) {
	return (session) => {
		if (!authEnabled) {
			return null;
		}
		const accessToken = session.account?.accessToken;

		const client = Client.initWithMiddleware({
			authProvider: {
				getAccessToken() {
					return accessToken;
				}
			}
		});
		const entraClient = new EntraClient(client);
		return new CachedEntraClient(entraClient, cache);
	};
}

/**
 * Wraps the EntraClient with a cache
 */
export class CachedEntraClient {
	/** @type {EntraClient} */
	#client;
	/** @type {MapCache} */
	#cache;

	/**
	 *
	 * @param {EntraClient} client
	 * @param {MapCache} cache
	 */
	constructor(client, cache) {
		this.#client = client;
		this.#cache = cache;
	}

	/**
	 * Fetch all group members - direct and indirect - of an Entra group, up to a maximum of 5000
	 *
	 * @param {string} groupId
	 * @returns {Promise<import('./types.js').GroupMember[]>}
	 */
	async listAllGroupMembers(groupId) {
		const key = CACHE_PREFIX + groupId;
		let members = this.#cache.get(key);
		if (members) {
			return members;
		}
		members = await this.#client.listAllGroupMembers(groupId);
		this.#cache.set(key, members);
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
		return this.#client.createEvent(userId, subject, body, start, lengthMins);
	}

	async getEvents(userId) {
		return this.#client.getEvents(userId);
	}
}
