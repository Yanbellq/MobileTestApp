import type { ICategory } from '@/shared/types/category.interface'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FilterPanel } from './FilterPanel'
import { SearchBar } from './SearchBar'

interface BrowseHeaderProps {
	searchOpen: boolean
	searchQuery: string
	filtersExpanded: boolean
	categories: ICategory[]
	selectedCategoryIds: number[]
	sortOption: 'date' | 'price' | 'title'
	sortDirection: 'asc' | 'desc'
	onToggleSearch: () => void
	onSearchChange: (value: string) => void
	onSearchClose: () => void
	onToggleFilters: () => void
	onToggleCategory: (id: number) => void
	onSortChange: (option: 'date' | 'price' | 'title') => void
	onSortDirectionChange: () => void
	onReset: () => void
}

export const BrowseHeader: React.FC<BrowseHeaderProps> = ({
	searchOpen,
	searchQuery,
	filtersExpanded,
	categories,
	selectedCategoryIds,
	sortOption,
	sortDirection,
	onToggleSearch,
	onSearchChange,
	onSearchClose,
	onToggleFilters,
	onToggleCategory,
	onSortChange,
	onSortDirectionChange,
	onReset
}) => {
	return (
		<View style={styles.headerContainer}>
			<>
				<View style={styles.headerTopRow}>
					<Text style={styles.pageTitle}>Browse Tasks</Text>
					<View style={styles.headerIconsRow}>
						<TouchableOpacity onPress={onToggleSearch}>
							<MaterialIcons
								name="search"
								size={20}
								color="#50FFA1"
							/>
						</TouchableOpacity>
						<MaterialIcons
							name="notifications-none"
							size={20}
							color="#50FFA1"
						/>
					</View>
				</View>
				{searchOpen && (
					<SearchBar
						value={searchQuery}
						onChangeText={onSearchChange}
						onClose={onToggleSearch}
					/>
				)}

				<View style={styles.toolbarRow}>
					<TouchableOpacity
						style={[
							styles.filterButton,
							filtersExpanded && styles.filterButtonActive
						]}
						onPress={onToggleFilters}
					>
						<Text
							style={[
								styles.filterButtonText,
								filtersExpanded && styles.filterButtonTextActive
							]}
						>
							Filter
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.sortStatus}
						onPress={onSortDirectionChange}
					>
						<Text style={styles.sortText}>
							Sort by: {sortOption}
						</Text>
						<MaterialIcons
							name={
								sortDirection === 'asc'
									? 'arrow-upward'
									: 'arrow-downward'
							}
							size={18}
							color="#50FFA1"
						/>
					</TouchableOpacity>
				</View>

				{filtersExpanded && (
					<FilterPanel
						categories={categories}
						selectedCategories={selectedCategoryIds}
						sortOption={sortOption}
						sortDirection={sortDirection}
						onCategorySelect={onToggleCategory}
						onSortChange={onSortChange}
						onSortDirectionChange={onSortDirectionChange}
						onReset={onReset}
					/>
				)}
			</>
		</View>
	)
}

const styles = StyleSheet.create({
	headerContainer: {
		paddingHorizontal: 24,
		paddingTop: 24,
		paddingBottom: 16,
		backgroundColor: '#012333',
		borderBottomWidth: 1,
		borderBottomColor: '#081F2C'
	},
	headerTopRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12
	},
	headerIconsRow: {
		flexDirection: 'row',
		columnGap: 16
	},
	pageTitle: {
		fontSize: 24,
		fontWeight: '800',
		color: '#EFFFF7'
	},
	toolbarRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 16,
		marginBottom: 8
	},
	filterButton: {
		borderColor: '#50FFA1',
		borderWidth: 1,
		borderRadius: 999,
		paddingHorizontal: 20,
		paddingVertical: 6
	},
	filterButtonActive: {
		backgroundColor: '#50FFA1'
	},
	filterButtonText: {
		color: '#50FFA1',
		fontWeight: '600'
	},
	filterButtonTextActive: {
		color: '#012333'
	},
	sortStatus: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 6
	},
	sortText: {
		color: '#EFFFF7'
	}
})
