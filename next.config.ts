import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	// image configuration
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'via.placeholder.com',
			},
		],
	},
};

export default nextConfig;
