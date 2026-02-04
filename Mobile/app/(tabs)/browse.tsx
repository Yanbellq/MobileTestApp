import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { BrowseHeader } from '@/components/pages/browse/BrowseHeader'
import { TaskCard } from '@/components/ui/TaskCard'
import { useCategories } from '@/hooks/useCategories'
import { useTasks } from '@/hooks/useTasks'
import { sortTasks } from '@/utils/taskFilters'
import { ITask } from '@/shared/types/task.interface'
import { createHref } from '@/utils/href'
import { PAGES } from '@/config/pages.config'

const BrowseTasks: React.FC = () => {
	const { categories } = useCategories()
	const params = useLocalSearchParams<{ category?: string }>()

	const [searchOpen, setSearchOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
	const [sortOption, setSortOption] = useState<'date' | 'price' | 'title'>(
		'date'
	)
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
	const [filtersExpanded, setFiltersExpanded] = useState(false)
	const [tasks, setTasks] = useState<ITask[]>([])

	const { tasks: baseTasks, loading, error, refetch } = useTasks(
		searchQuery,
		selectedCategoryIds,
		sortOption
	)

	useFocusEffect(
		useCallback(() => {
			refetch()
		}, [])
	)

	useEffect(() => {
		if (params.category) {
			const id = Number(params.category)
			if (!Number.isNaN(id)) {
				setSelectedCategoryIds([id])
				setFiltersExpanded(true)
			}
		}
	}, [params.category])

	useEffect(() => {
		setTasks(sortTasks(baseTasks, sortOption, sortDirection))
	}, [baseTasks, sortDirection, sortOption]);

	const toggleCategory = (id: number) => {
		if (id === -1) {
			setSelectedCategoryIds([])
			return
		}
		setSelectedCategoryIds(prev =>
			prev.includes(id)
				? prev.filter(catId => catId !== id)
				: [...prev, id]
		)
	}

	const handleReset = () => {
		setSelectedCategoryIds([])
		setSortOption('date')
		setSortDirection('desc')
		setSearchQuery('')
	}

	const renderContent = () => {
		if (loading) return <LoadingState />
		if (error) return <ErrorState message={error} />
		if (!tasks.length) {
			return (
				<EmptyState
					title="No tasks yet"
					message="New tasks will appear here once they are created."
				/>
			)
		}

		return (
			<View style={styles.listContainer}>
				{tasks.map(task => (
					<Link
						key={task.id}
						href={`/task/${task.id}`}
						// href={createHref(PAGES.TASK, { id: String(task.id) })}
						asChild
					>
						<TaskCard
							task={task}
							onPress={() => {}}
						/>
					</Link>
				))}
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<BrowseHeader
				searchOpen={searchOpen}
				searchQuery={searchQuery}
				filtersExpanded={filtersExpanded}
				categories={categories}
				selectedCategoryIds={selectedCategoryIds}
				sortOption={sortOption}
				sortDirection={sortDirection}
				onToggleSearch={() => setSearchOpen(prev => !prev)}
				onSearchChange={setSearchQuery}
				onSearchClose={() => setSearchQuery('')}
				onToggleFilters={() => setFiltersExpanded(prev => !prev)}
				onToggleCategory={toggleCategory}
				onSortChange={setSortOption}
				onSortDirectionChange={() =>
					setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
				}
				onReset={handleReset}
			/>
			<ScrollView contentContainerStyle={styles.content}>
				{renderContent()}
			</ScrollView>
		</View>
	)
}

export default BrowseTasks

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F3F5F9'
	},
	content: {
		paddingHorizontal: 24,
		paddingBottom: 24
	},
	listContainer: {
		gap: 12,
		paddingTop: 16
	}
})
