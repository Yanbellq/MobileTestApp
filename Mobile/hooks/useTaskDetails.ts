import apiClient from '@/lib/apiClient'
import type { ITask } from '@/shared/types/task.interface'
import { useQuery } from './useQuery'

export function useTaskDetails(taskId?: number) {
	const {
		data: task,
		loading,
		error,
		refetch
	} = useQuery<ITask | null>(
		{
			queryFn: async () => {
				try {
					const response = await apiClient.get(`/tasks/${taskId}`)
					const data = response.data
					console.log('DEBUG useTaskDetails response:', data)
					
					if (data) {
            // ✅ Трансформуємо offers: додаємо profile на верхній рівень
            const transformedData = {
              ...data,
              offers: data.offers?.map((offer: any) => ({
                ...offer,
                profile: offer.user?.profile || null  // ✅ Додаємо profile
              })) || []
            }
            
            return transformedData as ITask
          }

					return null
				} catch (err) {
					throw err
				}
			},
			enabled: !!taskId,
			initialData: null
		},
		[taskId]
	)

	return {
		task,
		loading: !!taskId ? loading : false,
		error: !!taskId ? error : 'Missing task id',
		refetch
	}
}
