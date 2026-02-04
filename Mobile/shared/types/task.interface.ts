import type { IOffer } from './offers.interface'
import type { Profile } from './user.interface'

export interface ITask {
	id: number
	createdAt: string
	authorId: string
	title: string
	description: string
	budget: number
	location: string
	address: string | null
	category: number
	startTask: string | null
	endTask: string | null
	status: TaskStatus
	// offer_id: number | null
	assignedOfferId?: number | null
	isPayed: boolean
	offersCount?: number
	offers?: IOffer[]
	profile?: Profile | null
	author?: {
		id: string
		profile: Profile
	}
}

export type TaskStatus =
	| 'ASSIGNED'
	| 'CANCELED'
	| 'OPEN'
	| 'COMPLETED'
	| 'APPLIED'
