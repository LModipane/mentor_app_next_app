import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // your drizzle db connection
import { users } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key';

export async function POST(req: Request) {
	try {
		const { username, password } = await req.json();

		// 1️⃣ Basic validation
		if (!username || !password) {
			return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
		}

		// 2️⃣ Check if username or email already exists
		const existingUser = await db.query.users.findFirst({
			where: or(eq(users.username, username)),
		});

		if (existingUser) {
			return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 });
		}

		// 3️⃣ Hash password
		const passwordHash = await bcrypt.hash(password, 10);

		// 4️⃣ Insert into DB
		const [newUser] = await db
			.insert(users)
			.values({
				username,
				passwordHash,
			})
			.returning({ id: users.id, username: users.username });

		// 5️⃣ Create JWT
		const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET_KEY, {
			expiresIn: '1d',
		});

		// 6️⃣ Store token in HTTP-only cookie
		(await cookies()).set({
			name: 'token',
			value: token,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			maxAge: 60 * 60 * 24, // 1 day
		});

		return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
