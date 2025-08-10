'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const RegisterForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const res = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});
			if (res.status !== 201) throw new Error('Registration failed');

			const data = await res.json();
			alert(data.message || 'Registration successful');
		} catch (error) {
			console.error('Registration failed:', error);
			alert('Registration failed. Please try again.');
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-2 m-1">
			<div className="m-2">
				<h1 className="text-4xl">Register</h1>
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
						already have an account?:{' '}
						<Link href="/Login" className="text-blue-500">
							login here
						</Link>
					</span>
				</div>
			</form>
		</div>
	);
};

export default RegisterForm;
