export type UserType = 'WORKER' | 'EMPLOYER'

export interface Profile {
	name: string | null
	role: UserType | null
	avatarUrl: string | null
}

export interface AuthUser {
	id: string
	email: string | null
	profile: Profile | null
	createdAt: string | null
}
