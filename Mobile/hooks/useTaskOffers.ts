import apiClient from '@/lib/apiClient'
import type { IOffer } from '@/shared/types/offers.interface'
import { useQuery } from './useQuery'

export function useTaskOffers(taskId: number | undefined) {
	const {
		data: offers,
		loading,
		error,
		refetch
	} = useQuery<IOffer[]>(
		{
			queryFn: async () => {
				try {
					const response = await apiClient.get(`/tasks/${taskId}/offers`)
					
					console.log('DEBUG useTaskOffers transformed:', response.data)
					return response.data as IOffer[]
				} catch (err) {
					throw err
				}
			},
			enabled: !!taskId,
			initialData: []
		},
		[taskId]
	)

	return { offers: offers ?? [], loading, error, refetch }
}
