'use client';
import Link from 'next/link';
import React, { useState } from 'react';

const LoginForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});
			if (res.status !== 200) throw new Error('Login failed');

			const data = await res.json();
			console.log('Login successful:', data);
			// Store token
			localStorage.setItem('jwt_token', data.token);
		} catch (error) {
			console.error('Login failed:', error);
			alert('Login failed. Please try again.');
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-2 m-1">
			<div className="m-2">
				<h1 className="text-4xl">Login</h1>
			</div>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col items-center justify-center m-[10px] mx-auto p-5 rounded-lg shadow-md w-[500px] ">
				<input
					type="text"
					placeholder="please enter your username..."
					className="w-[95%] p-2.5 my-2.5 border border-gray-300 rounded box-border bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
					value={username}
					onChange={e => setUsername(e.target.value)}
				/>
				<input
					type="password"
					placeholder="please enter your password..."
					className="w-[95%] p-2.5 my-2.5 border border-gray-300 rounded box-border bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>

				<div className="w-full flex flex-col items-center">
					<button
						type="submit"
						className="w-[95%] p-2.5 my-5 bg-blue-500 text-white rounded cursor-pointer transition-colors duration-200 hover:bg-blue-800">
						Submit
					</button>
					<span className="capitalize text-sm text-gray-500 dark:text-gray-400">
						don&apos;t have an account?:{' '}
						<Link href="/Register" className="text-blue-500">
							register here
						</Link>
					</span>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
