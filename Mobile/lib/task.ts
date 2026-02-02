import type { ITask } from '@/shared/types/task.interface'
import { apiClient } from './apiClient'

export async function fetchTasks(
	searchQuery?: string,
	categoryIds?: number[],
	sortOption: 'date' | 'price' | 'title' = 'date'
): Promise<ITask[]> {
	try {
		const params = new URLSearchParams()

		if (searchQuery) {
			params.append('search', searchQuery)
		}

		if (categoryIds && categoryIds.length > 0) {
			params.append('categories', categoryIds.join(','))
		}

		params.append('sort', sortOption)

		const response = await apiClient.get<ITask[]>(`/tasks?${params.toString()}`)
		return response.data || []
	} catch (error) {
		console.error('Помилка при отриманні завдань:', error)
		throw error
	}
}

export async function createTask(options: {
	authorId: string
	title: string
	description: string
	budget: number
	location: string
	category: number
	address?: string | null
	startTask?: string | null
	endTask?: string | null
}): Promise<ITask> {
	try {
		const response = await apiClient.post<ITask>('/tasks', {
			title: options.title,
			description: options.description,
			budget: options.budget,
			location: options.location,
			category: options.category,
			address: options.address || null,
			startTask: options.startTask || null,
			endTask: options.endTask || null
		})
		return response.data
	} catch (error: any) {
		const message =
			error.response?.data?.message || 'Помилка при створенні завдання'
		throw new Error(message)
	}
}

export async function fetchMyTasks(
	userId: string,
	userType: string | null,
	statusFilter: string = 'All',
	searchQuery?: string,
	sortOption: 'date' | 'price' | 'title' = 'date'
): Promise<ITask[]> {
	try {
		const params = new URLSearchParams()

		if (statusFilter !== 'All') {
			params.append('status', statusFilter)
		}

		if (searchQuery) {
			params.append('search', searchQuery)
		}

		params.append('sort', sortOption)

		const endpoint = userType === 'WORKER' ? '/tasks/assigned' : '/tasks/my'

		const response = await apiClient.get<any[]>(
			`${endpoint}?${params.toString()}`
		)

		return response.data as ITask[]
	} catch (error) {
		console.error('Помилка при отриманні моїх завдань:', error)
		throw error
	}
}

export async function updateTask(
	taskId: number,
	updates: Partial<ITask>
): Promise<ITask> {
	try {
		const response = await apiClient.put<ITask>(`/tasks/${taskId}`, updates)
		return response.data
	} catch (error: any) {
		const message =
			error.response?.data?.message || 'Помилка при оновленні завдання'
		throw new Error(message)
	}
}

export async function deleteTask(taskId: number): Promise<void> {
	try {
		await apiClient.delete(`/tasks/${taskId}`)
	} catch (error: any) {
		const message =
			error.response?.data?.message || 'Помилка при видаленні завдання'
		throw new Error(message)
	}
}

export async function unassignTask(taskId: number): Promise<ITask> {
	try {
		const response = await apiClient.patch<ITask>(`/tasks/${taskId}/unassign`)
		return response.data
	} catch (error: any) {
		const message =
			error.response?.data?.message || 'Помилка при скасуванні призначення'
		throw new Error(message)
	}
}
