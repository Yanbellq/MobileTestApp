import { fetchCategories } from '@/lib/category'
import type { ICategory } from '@/shared/types/category.interface'
import { useQuery } from './useQuery'

export function useCategories() {
	const {
		data: categories,
		loading,
		error
	} = useQuery<ICategory[]>({
		queryFn: fetchCategories,
		initialData: []
	})

	return { categories: categories ?? [], loading, error }
}
