import { pgTable, serial, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable(
	'users',
	{
		id: serial('id').primaryKey(),
		username: varchar('username', { length: 50 }).notNull(),
		passwordHash: varchar('password_hash', { length: 255 }).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	table => {
		return {
			usernameIdx: uniqueIndex('users_username_idx').on(table.username),
		};
	},
);
