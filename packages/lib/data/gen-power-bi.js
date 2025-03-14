import { fakerEN_GB as faker } from '@faker-js/faker';
import { fetchInspectors } from './inspectors.js';
import { writeFile, mkdir, access, readFile } from 'fs/promises';
import * as constants from 'node:constants';

const config = {
	inspectorCount: 200,
	weeksFromToday: 4,
	readUsers: false
};

const groups = [
	{ id: 1, name: 'Group A', targetUtilisation: 0.47 },
	{ id: 2, name: 'Group B', targetUtilisation: 0.52 },
	{ id: 3, name: 'Group C', targetUtilisation: 0.15 },
	{ id: 4, name: 'Group D', targetUtilisation: 0.23 },
	{ id: 5, name: 'Group E', targetUtilisation: 0.9 }
];

const workingHours = timesBetween('07:00', '19:00');

// meeting lengths in 30 mins units
const weightedMeetingLengths = [
	{ weight: 100, value: 1 }, // 30 mins
	{ weight: 80, value: 2 }, // 1 hr
	{ weight: 30, value: 4 }, // 2 hr
	{ weight: 5, value: 8 } // 4 hr
];

/**
 * Generate mock data for Power BI
 */
async function generateMockPowerBiResponse() {
	const startDate = new Date();
	startDate.setDate(startDate.getDate() + 1);
	startDate.setHours(0, 0, 0, 0);
	const endDate = new Date(startDate);
	endDate.setDate(endDate.getDate() + config.weeksFromToday * 7);

	const weekdays = weekdayDates(startDate, endDate);
	console.log('working hours, between:', workingHours[0], workingHours[workingHours.length - 1]);
	console.log('Dates, between:', weekdays[0], weekdays[weekdays.length - 1]);

	let users;
	if (config.readUsers) {
		users = await readUsers();
	} else {
		const inspectors = await fetchInspectors(config.inspectorCount);
		users = inspectors.map(mapInspectorToUser);
	}
	const events = [];
	for (const user of users) {
		const group = groups.find((g) => g.name === user.groupId);
		const targetUtilisation = group.targetUtilisation;
		events.push(...eventsForUser(user, weekdays, targetUtilisation));
	}
	console.log('generated', { users: users.length, events: events.length });
	await ensureDirectoryExists('./tmp');
	await writeJsonFile('./tmp/users.json', users);
	await writeJsonFile('./tmp/events.json', events);
	console.log('written to files');
}

function eventsForUser(user, workingDays, targetUtilisation) {
	const events = [];
	for (let i = 0; i < workingDays.length; i++) {
		const workingDay = workingDays[i];

		for (let j = 0; j < workingHours.length; j++) {
			const hasMeeting = faker.helpers.maybe(() => true, { probability: targetUtilisation });
			if (!hasMeeting) {
				continue;
			}
			const meetingLength = faker.helpers.weightedArrayElement(weightedMeetingLengths);
			const meetingStart = workingHours[j];
			let meetingEndIndex;
			if (j + meetingLength > workingHours.length) {
				meetingEndIndex = workingHours.length - 1;
			} else {
				meetingEndIndex = j + meetingLength;
			}
			const meetingEnd = workingHours[meetingEndIndex];

			events.push(event(user, meetingStart, meetingEnd, workingDay));
			if (j < workingHours.length) {
				j = meetingEndIndex + 1;
			}
		}
	}
	return events;
}

/**
 * @param {import('./types.js').Inspector} inspector
 * @returns {import('./types.js').PowerBiConnectorUser}
 */
function mapInspectorToUser(inspector) {
	return {
		id: inspector.id,
		displayName: `${inspector.firstName} ${inspector.lastName}`,
		email: inspector.emailAddress,
		groupId: faker.helpers.arrayElement(groups).name
	};
}

/**
 * @param {{email: string}} user
 * @param {string} meetingStart
 * @param {string} meetingEnd
 * @param {Date} date
 * @returns {{id: string, userEmail, title: string, startDate: Date, endDate: Date}}
 */
function event(user, meetingStart, meetingEnd, date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
	const day = String(date.getDate()).padStart(2, '0');

	const startDate = new Date(`${year}-${month}-${day}T${meetingStart}:00`);
	const endDate = new Date(`${year}-${month}-${day}T${meetingEnd}:00`);

	return {
		id: faker.string.uuid(),
		userEmail: user.email,
		title: faker.lorem.sentence(),
		startDate,
		endDate
	};
}

/**
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Date[]}
 */
function weekdayDates(startDate, endDate) {
	const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday (0 = Sunday, 6 = Saturday)

	let currentDate = startDate;
	const weekdayDates = [];

	while (currentDate <= endDate) {
		currentDate.getDay();
		const dayOfWeek = currentDate.getDay();
		if (weekdays.includes(dayOfWeek)) {
			weekdayDates.push(new Date(currentDate)); // Add a copy of the date to the array
		}
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return weekdayDates;
}

/**
 * @param {string} start
 * @param {string} end
 * @returns {Date[]}
 */
function timesBetween(start, end) {
	const times = [];
	let currentDate = new Date(`2021-01-01T${start}:00Z`);
	const endDate = new Date(`2021-01-01T${end}:00Z`);

	while (currentDate <= endDate) {
		times.push(currentDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
		currentDate.setMinutes(currentDate.getMinutes() + 30);
	}

	return times;
}

async function readUsers() {
	const data = await readFile('./tmp/users.json');
	return JSON.parse(data.toString());
}

async function writeJsonFile(filename, data) {
	await writeFile(filename, JSON.stringify(data, null, 2));
}

async function ensureDirectoryExists(dirPath) {
	try {
		await access(dirPath, constants.F_OK);
		console.log(`Directory ${dirPath} already exists`);
	} catch (err) {
		if (err.code === 'ENOENT') {
			await mkdir(dirPath, { recursive: true });
			console.log(`Directory ${dirPath} created`);
		} else {
			console.error(`Error checking directory ${dirPath}:`, err);
		}
	}
}

await generateMockPowerBiResponse();
