import AsyncStorage from '@react-native-async-storage/async-storage'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react'

import apiClient from '@/lib/apiClient'
import type { AuthUser } from '@/shared/types/user.interface'

export type AuthContextValue = {
	user: AuthUser | null
	loading: boolean
	refreshUser: () => Promise<void>
	isAuthenticated: boolean
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<AuthUser | null>(null)
	const [loading, setLoading] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	const hydrateUser = async (userId: string) => {
		try {
			const response = await apiClient.get(`/users/${userId}`)

			setUser({
				id: response.data.id,
				email: response.data.email ?? null,
				profile: {
					name: response.data.profile?.name ?? null,
					role: response.data.profile?.role ?? null,
					avatarUrl: response.data.profile?.avatarUrl ?? null
				},
				createdAt: response.data.createdAt ?? null
			})
			setIsAuthenticated(true)
		} catch (error) {
			console.error('Failed to load profile:', error)
			setUser(null)
			setIsAuthenticated(false)
		}
	}

	const logout = async () => {
		try {
			setUser(null)
			setIsAuthenticated(false)
			await AsyncStorage.removeItem('authToken')

			try {
				await apiClient.post('/auth/logout')
			} catch (error) {
				console.warn('Помилка при виклику logout на сервері:', error)
			}
		} catch (error) {
			console.error('Failed to logout:', error)
			throw error
		}
	}

	const refreshUser = async () => {
		try {
			const token = await AsyncStorage.getItem('authToken')
			if (!token) {
				setUser(null)
				setIsAuthenticated(false)
				return
			}

			const response = await apiClient.get('/auth/me')
			const returnData = {
				id: response.data.id,
				email: response.data.email ?? null,
				profile: {
					name: response.data.profile?.name ?? null,
					role: response.data.profile?.role ?? null,
					avatarUrl: response.data.profile?.avatarUrl ?? null
				},
				createdAt: response.data.profile.createdAt ?? null
			}
			setUser(returnData);
			console.log("DEBUG useAuth auth/me USER Response : ", response.data)
			console.log("DEBUG useAuth auth/me USER userState : ", returnData)
			setIsAuthenticated(true)
		} catch (error) {
			console.error('Failed to refresh user:', error)
			await AsyncStorage.removeItem('authToken')
			setUser(null)
			setIsAuthenticated(false)
		}
	}

	useEffect(() => {
		const init = async () => {
			try {
				const token = await AsyncStorage.getItem('authToken')

				if (token) {
					const response = await apiClient.get('/auth/me')
					await hydrateUser(response.data.id)
				} else {
					setUser(null)
					setIsAuthenticated(false)
				}
			} catch (error) {
				console.error('Failed to initialize auth state:', error)
				await AsyncStorage.removeItem('authToken')
				setUser(null)
				setIsAuthenticated(false)
			} finally {
				setLoading(false)
			}
		}

		init()
	}, [])

	return (
		<AuthContext.Provider
			value={{ user, loading, refreshUser, isAuthenticated, logout }}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const ctx = useContext(AuthContext)
	if (!ctx) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return ctx
}
