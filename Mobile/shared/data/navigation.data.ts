import { Account, Done, Messages, Search, Tasks } from '@/components/icons'
import { TNavLink } from '../types/navigation.type'

export const links: TNavLink[] = [
	{
		name: 'index',
		href: '/',
		icon: Done,
		label: 'Get it Done'
	},
	{
		name: 'browse',
		href: '/browse',
		icon: Search,
		label: 'Browse'
	},
	{
		name: 'my-tasks',
		href: '/my-tasks',
		icon: Tasks,
		label: 'My Tasks'
	},
	{
		name: 'messages',
		href: '/messages',
		icon: Messages,
		label: 'Messages'
	},
	{
		name: 'account',
		href: '/account',
		icon: Account,
		label: 'Account'
	}
]
