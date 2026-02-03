import { Account, Done, Messages, Search, Tasks } from '@/components/icons'
import { PAGES } from '@/config/pages.config'
import { TNavLink } from '../types/navigation.type'

export const links: TNavLink[] = [
	{
		name: 'index',
		href: PAGES.HOME,
		icon: Done,
		label: 'Get it Done'
	},
	{
		name: 'browse',
		href: PAGES.BROWSE,
		icon: Search,
		label: 'Browse'
	},
	{
		name: 'my-tasks',
		href: PAGES.MY_TASKS,
		icon: Tasks,
		label: 'My Tasks'
	},
	{
		name: 'messages',
		href: PAGES.MESSAGES,
		icon: Messages,
		label: 'Messages'
	},
	{
		name: 'account',
		href: PAGES.ACCOUNT,
		icon: Account,
		label: 'Account'
	}
]
