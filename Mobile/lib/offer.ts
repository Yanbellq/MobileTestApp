import type { IOffer } from '@/shared/types/offers.interface'
import type { ITask } from '@/shared/types/task.interface'
import { apiClient } from './apiClient'

export async function createOffer(options: {
	taskId: number
	userId: string
	amount: number
}): Promise<IOffer> {
	try {
		const response = await apiClient.post<IOffer>('/offers', {
			taskId: options.taskId,
			amount: options.amount
		})
		return response.data
	} catch (error: any) {
		const message =
			error.response?.data?.message || 'Помилка при створенні пропозиції'
		throw new Error(message)
	}
}

export async function assignOffer(
	taskId: number,
	offerId: number
): Promise<ITask> {
	try {
		const response = await apiClient.patch<ITask>(`/offers/${offerId}/assign`, {
			taskId
		})
		return response.data
	} catch (error: any) {
		const message =
			error.response?.data?.message || 'Помилка при призначенні пропозиції'
		throw new Error(message)
	}
}

export async function completeTask(taskId: number): Promise<ITask> {
	try {
		const response = await apiClient.patch<ITask>(`/tasks/${taskId}/complete`)
		return response.data
	} catch (error: any) {
		const message =
			error.response?.data?.message || 'Помилка при завершенні завдання'
		throw new Error(message)
	}
}

export async function payTask(taskId: number): Promise<ITask> {
	try {
		const response = await apiClient.patch<ITask>(`/tasks/${taskId}/pay`)
		return response.data
	} catch (error: any) {
		const message =
			error.response?.data?.message || 'Помилка при оплаті завдання'
		throw new Error(message)
	}
}
