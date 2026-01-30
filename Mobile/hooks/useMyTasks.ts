import { fetchMyTasks } from '@/lib/task'
import type { ITask } from '@/shared/types/task.interface'
import type { UserType } from '@/shared/types/user.interface'
import { useQuery } from './useQuery'

export function useMyTasks(
	userId: string | null,
	userType: UserType,
	statusFilter: string = 'all',
	searchQuery?: string,
	sortOption: 'date' | 'price' | 'title' = 'date'
) {
	const {
		data: tasks,
		loading,
		error,
		refetch
	} = useQuery<ITask[]>(
		{
			queryFn: () =>
				fetchMyTasks(
					userId!,
					userType!,
					statusFilter,
					searchQuery,
					sortOption
				),
			enabled: !!userId && !!userType,
			initialData: []
		},
		[userId, userType, statusFilter, searchQuery, sortOption]
	)

	return { tasks: tasks ?? [], loading, error, refetch }
}
