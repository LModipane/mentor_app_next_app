import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // your drizzle db connection
import { users } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
	try {
		const { username, password } = await req.json();

		// Basic validation
		if (!username || !password) {
			return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
		}

		// Check if username or email already exists
		const existingUser = await db.query.users.findFirst({
			where: or(eq(users.username, username)),
		});

		if (existingUser) {
			return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 });
		}

		// Hash the password
		const passwordHash = await bcrypt.hash(password, 10);

		// Insert into DB
		await db.insert(users).values({
			username,
			passwordHash,
		});

		return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
