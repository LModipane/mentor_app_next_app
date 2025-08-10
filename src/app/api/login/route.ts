import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db'; // your drizzle db connection

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key'; // store in .env

export async function POST(req: Request) {
	try {
		const { username, password } = await req.json();

		if (!username || !password)
			return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

		const userDB = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.username, username),
		});

		if (!userDB) return NextResponse.json({ error: 'User not found' }, { status: 404 });

		if (username !== userDB.username)
			return NextResponse.json({ error: 'Invalid username' }, { status: 401 });

		const validPassword = await bcrypt.compare(password, userDB.passwordHash);
		if (!validPassword) {
			return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
		}

		// Create JWT
		const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

		return NextResponse.json({ token }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
