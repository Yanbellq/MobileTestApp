import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosInstance } from 'axios'
import { Platform } from 'react-native'

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL 
const API_BASE_URL = Platform.OS === 'android' 
  ? process.env.EXPO_PUBLIC_API_ANDROID_URL 
  : process.env.EXPO_PUBLIC_API_URL;

/**
 * Створює HTTP клієнт з автоматичною відправкою JWT токена
 */
export const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json'
	}
})

/**
 * Інтерцептор для додавання JWT токена до кожного запиту
 */
apiClient.interceptors.request.use(
	async config => {
		try {
			const token = await AsyncStorage.getItem('authToken')
			if (token) {
				config.headers.Authorization = `Bearer ${token}`
			}
		} catch (error) {
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

/**
 * Інтерцептор для обробки помилок
 */
apiClient.interceptors.response.use(
	response => response,
	async error => {
		if (error.response?.status === 401) {
			await AsyncStorage.removeItem('authToken')
		}

		if (error.response && error.response.data && error.response.data.message) {
			const customError = {
				message: error.response.data.message,
				statusCode: error.response.status
			}
			return Promise.reject(new Error(customError.message))
		}

		return Promise.reject(error)
	}
)

export default apiClient
