import { ICategory } from '@/shared/types/category.interface'
import { useRouter } from 'expo-router'
import { CategoryCard } from '../ui/CategoryCard'

interface Props {
	data: ICategory[]
	onCategorySelect?: () => void
}

export function CategoryGrid({ data, onCategorySelect }: Props) {
	const router = useRouter()

	const handleCategoryPress = (categoryId: number) => {
		if (onCategorySelect) {
			onCategorySelect()
		}
		router.push(`/browse?category=${categoryId}`)
	}

	return (
		<>
			{data.map(category => (
				<CategoryCard
					key={category.id}
					title={category.name}
					icon={category.icon}
					onPress={() => handleCategoryPress(category.id)}
				/>
			))}
		</>
	)
}
