import { sveltekit } from '@sveltejs/kit/vite';


import { configureServer } from './src/chat/chat.js';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer
}

const config = {
	plugins: [sveltekit(),webSocketServer]
};

export default config;
