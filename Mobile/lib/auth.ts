// Оновлення профілю
import type { UserType } from '@/shared/types/user.interface'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiClient } from './apiClient'
export async function updateProfile(options: {
	name?: string
	email?: string
	avatarUrl?: string
}): Promise<void> {
	try {
		await apiClient.patch('/auth/profile', options)
	} catch (error: any) {
		const message = error.message || 'Помилка оновлення профілю'
		throw new Error(message)
	}
}

// Зміна паролю
export async function updatePassword(options: {
	currentPassword: string
	newPassword: string
}): Promise<void> {
	try {
		await apiClient.patch('/auth/password', options)
	} catch (error: any) {
		const message = error.message || 'Помилка зміни паролю'
		throw new Error(message)
	}
}

export interface SignUpResponse {
	access_token: string
	user: {
		id: string
		email: string
		profile: {
			name: string
			role: UserType
			avatarUrl: string | null
		}
	}
}

export async function signUpWithEmail(options: {
	email: string
	password: string
	userType: UserType
	name: string
}): Promise<SignUpResponse> {
	try {
		const response = await apiClient.post<SignUpResponse>(
			'/auth/register',
			options
		)

		// Зберегти токен
		await AsyncStorage.setItem('authToken', response.data.access_token)

		return response.data
	} catch (error: any) {
		const message = error.message || 'Помилка реєстрації'
		throw new Error(message)
	}
}

export async function signInWithEmail(options: {
	email: string
	password: string
}): Promise<SignUpResponse> {
	try {
		const response = await apiClient.post<SignUpResponse>(
			'/auth/login',
			options
		)

		// Зберегти токен
		await AsyncStorage.setItem('authToken', response.data.access_token)

		return response.data
	} catch (error: any) {
		const message = error.message || 'Помилка входу'
		throw new Error(message)
	}
}

export async function signOut(): Promise<void> {
	try {
		// Видалити токен з клієнта
		await AsyncStorage.removeItem('authToken')

		// Опціонально: повідомити сервер про вихід
		try {
			await apiClient.post('/auth/logout')
		} catch (error) {
		}
	} catch (error: any) {
		throw new Error('Помилка при виході')
	}
}