import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import { Dashboard } from '@/components';
import Image from 'next/image';

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key';

export default async function Home() {
	const token = (await cookies()).get('token')?.value;
	if (!token) redirect('/Login');

	try {
		jwt.verify(token, SECRET_KEY);
	} catch {
		redirect('/Login');
	}

	const mentors = [
		{
			image: 'https://via.placeholder.com/280x180',
			name: 'James Rodriguez',
			experience: '8+ years in Software Engineering',
			bio: 'Full-stack developer specializing in JavaScript frameworks and cloud technologies.',
			expertise: ['JavaScript', 'React', 'AWS'],
			socialLinks: [
				{ icon: 'https://via.placeholder.com/24', alt: 'LinkedIn', url: '#' },
				{ icon: 'https://via.placeholder.com/24', alt: 'Twitter', url: '#' },
			],
		},
		{
			image: 'https://via.placeholder.com/280x180',
			name: 'Sarah Kim',
			experience: '5+ years in Data Science',
			bio: 'Data scientist with a passion for machine learning, AI, and predictive analytics.',
			expertise: ['Python', 'Machine Learning', 'SQL'],
			socialLinks: [
				{ icon: 'https://via.placeholder.com/24', alt: 'LinkedIn', url: '#' },
				{ icon: 'https://via.placeholder.com/24', alt: 'GitHub', url: '#' },
			],
		},
		{
			image: 'https://via.placeholder.com/280x180',
			name: 'Alex Johnson',
			experience: '10+ years in Cloud Architecture',
			bio: 'Cloud solutions architect experienced in building scalable systems with AWS and Azure.',
			expertise: ['AWS', 'Azure', 'Docker'],
			socialLinks: [
				{ icon: 'https://via.placeholder.com/24', alt: 'LinkedIn', url: '#' },
				{ icon: 'https://via.placeholder.com/24', alt: 'Twitter', url: '#' },
			],
		},
	];

	return (
		<main className="h-full w-full flex bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
			<Dashboard />
			<div className="flex-1 p-6">
				<div className="p-4 rounded-lg mb-6 w-full">
					<h1 className="text-2xl font-bold mb-4 ">Welcome to the Mentor Dashboard</h1>
				</div>
				<ul className="flex flex-wrap gap-4 scrollbar h-[85%] overflow-y-scroll">
					{mentors.map((mentor, index) => (
						<MentorCard key={index} {...mentor} />
					))}
				</ul>
			</div>
		</main>
	);
}

type MentorCardProps = {
	image: string;
	name: string;
	experience: string;
	bio: string;
	expertise: string[];
	onContact?: () => void;
	socialLinks?: { icon: string; alt: string; url: string }[];
};

const MentorCard: React.FC<MentorCardProps> = ({
	image,
	name,
	experience,
	bio,
	expertise,
	onContact,
	socialLinks = [],
}) => {
	return (
		<div className="bg-white rounded-lg shadow-md w-[280px] overflow-hidden transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
			<Image
				src={image}
				alt={name}
				className="w-full h-[180px] object-cover"
				width={30}
				height={30}
			/>

			<div className="p-5">
				<h2 className="text-[1.4rem] text-[#2c3e50] mb-2 font-semibold">{name}</h2>
				<p className="text-base text-[#7f8c8d] mb-4">{experience}</p>
				<p className="text-sm text-[#34495e] mb-4 leading-relaxed">{bio}</p>

				<div className="flex flex-wrap gap-2 mb-4">
					{expertise.map((tag, idx) => (
						<span key={idx} className="bg-[#e0f7fa] text-[#00838f] px-3 py-1 rounded-full text-xs">
							{tag}
						</span>
					))}
				</div>

				<div className="flex justify-between items-center">
					<button
						onClick={onContact}
						className="bg-[#3498db] text-white px-4 py-2 rounded hover:bg-[#2980b9] text-sm transition-colors duration-300">
						Contact
					</button>
					<div className="flex gap-2">
						{socialLinks.map((social, idx) => (
							<a key={idx} href={social.url} target="_blank" rel="noopener noreferrer">
								<Image
									src={social.icon}
									alt={social.alt}
									className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity duration-300"
									width={24}
									height={24}
								/>
							</a>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
