import { colors } from '@/shared/data/colors.data'
import { getIconForCategory } from '@/utils/category'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface CategoryCardProps {
	title: string
	icon: string
	onPress: () => void
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
	title,
	icon,
	onPress
}) => {
	const Icon = getIconForCategory(icon)

	if (!Icon) {
		return null
	}

	return (
		<TouchableOpacity
			style={styles.categoryCard}
			onPress={onPress}
			activeOpacity={0.85}
		>
			<Icon />
			<Text style={styles.categoryCardText}>{title}</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	categoryCard: {
		flex: 1,
		minWidth: 165,
		height: 120,
		backgroundColor: colors.categoryCardBackground,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center'
	},
	categoryCardText: {
		fontSize: 20,
		textAlign: 'center',
		marginTop: 8,
		color: colors.primary,
		fontWeight: '600'
	}
})
