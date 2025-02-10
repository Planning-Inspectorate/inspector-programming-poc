import { Prisma } from '@prisma/client';

interface Config {
	auth: {
		authority: string;
		clientId: string;
		clientSecret: string;
		disabled: boolean;
		groups: {
			// group ID for accessing the application
			applicationAccess: string;
		};
		redirectUri: string;
		signoutUrl: string;
	};
	entra: {
		// group cache ttl in minutes
		cacheTtl: number;
		groupIds: {};
	};
	gitSha?: string;
	logLevel: string;
	maps: {
		key: string;
		secret: string;
	};
	NODE_ENV: string;
	httpPort: number;
	session: {
		redisPrefix: string;
		redis?: string;
		secret: string;
	};
	srcDir: string;
	staticDir: string;
}
