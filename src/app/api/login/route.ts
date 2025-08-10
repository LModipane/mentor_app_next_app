import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key';

export async function POST(req: Request) {
	const { username, password } = await req.json();

	const user = await db.query.users.findFirst({
		where: eq(users.username, username),
	});

	if (!user) {
		return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const valid = await bcrypt.compare(password, user.passwordHash);
	if (!valid) {
		return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
		expiresIn: '1d',
	});

	(await cookies()).set({
		name: 'token',
		value: token,
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: 60 * 60 * 24,
	});

	return NextResponse.json({ message: 'Login successful' });
}
