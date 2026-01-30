import type { ICategory } from '@/shared/types/category.interface'
import { apiClient } from './apiClient'

export async function fetchCategories(): Promise<ICategory[]> {
	try {
		const response = await apiClient.get<ICategory[]>('/categories')
		// console.log(response.data)
		return response.data || []
	} catch (error) {
		console.error('Помилка при отриманні категорій:', error)
		throw error
	}
}
