import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key';

export default async function Home() {
	const token = (await cookies()).get('token')?.value;
	if (!token) redirect('/Login');

	try {
		jwt.verify(token, SECRET_KEY);
	} catch {
		redirect('/Login');
	}
	return (
		<main className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
			Explore
		</main>
	);
}
