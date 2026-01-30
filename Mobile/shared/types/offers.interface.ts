import { Profile } from './user.interface'

export interface IOffer {
	id: number
	createdAt: string
	taskId: number
	userId: string
	amount: number
	isAssigned: boolean
	profile: Profile | null
}
