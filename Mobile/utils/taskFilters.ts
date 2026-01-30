import type { ITask } from '@/shared/types/task.interface'

export const filterTasks = (
	tasks: ITask[],
	searchQuery: string,
	selectedCategoryIds: number[]
): ITask[] => {
	const query = searchQuery.trim().toLowerCase()
	return tasks.filter(task => {
		const matchesSearch = query
			? `${task.title} ${task.description}`.toLowerCase().includes(query)
			: true
		const matchesCategory = selectedCategoryIds.length
			? selectedCategoryIds.includes(task.category)
			: true
		return matchesSearch && matchesCategory
	})
}

export const sortTasks = (
	tasks: ITask[],
	sortOption: 'date' | 'price' | 'title',
	direction: 'asc' | 'desc' = 'desc'
): ITask[] => {
	const copy = [...tasks]
	const mul = direction === 'asc' ? 1 : -1
	switch (sortOption) {
		case 'price':
			return copy.sort((a, b) => mul * (a.budget - b.budget))
		case 'title':
			return copy.sort((a, b) => mul * a.title.localeCompare(b.title))
		case 'date':
		default:
			return copy.sort(
				(a, b) =>
					mul *
					(new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf())
			)
	}
}
