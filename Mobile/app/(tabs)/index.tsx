import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { EmptyState, ErrorState, LoadingState } from '@/components/common'
import { CategoryGrid } from '@/components/container/CategoryGrid'
import { CreateTaskSection } from '@/components/pages/home/CreateTaskSection'
import { useAuth } from '@/hooks/useAuth'
import { useCategories } from '@/hooks/useCategories'

const Home: React.FC = () => {
	const { user } = useAuth()
	const { categories, loading, error } = useCategories()

	const renderContent = () => {
		if (loading) return <LoadingState />
		if (error) return <ErrorState message={error} />
		if (!categories.length) return <EmptyState title="No categories yet" />

		return (
			<View style={styles.categoryGrid}>
				<CategoryGrid data={categories} />
			</View>
		)
	}

	return (
		<>
			<ScrollView>
				{user?.profile?.role === 'EMPLOYER' && <CreateTaskSection />}

				<View style={styles.mainContent}>
					<Text style={styles.mainTitle}>Need something done?</Text>
					<Text style={styles.mainSubtitle}>Browse our top categories</Text>

					{renderContent()}
				</View>
			</ScrollView>
		</>
	)
}

export default Home

const styles = StyleSheet.create({
	mainContent: {
		flex: 1,
		width: '100%',
		backgroundColor: '#F3F5F9',
		paddingVertical: 32,
		paddingHorizontal: 23,
		margin: 'auto'
	},
	mainTitle: {
		fontSize: 24
	},
	mainSubtitle: {
		fontSize: 16
	},
	categoryGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		columnGap: 8,
		rowGap: 8,
		marginTop: 46
	}
})
