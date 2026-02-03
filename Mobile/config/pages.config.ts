import { Href } from 'expo-router'

export const PAGES: Record<string, Href> = {
	HOME: '/',
	BROWSE: '/browse',
	MESSAGES: '/messages',
	ACCOUNT: '/account',
	
	TASK: '/task/',
	MY_TASKS: '/my-tasks',
	ADD_TASK: '/add-tasks',

	LOGIN: '/auth/login',
	REGISTER: '/auth/register'
} as const

export const API_PAGES = {}
