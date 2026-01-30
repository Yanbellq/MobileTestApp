import {
	AirCondition,
	ConstructionCleaning,
	Electrician,
	Flooring,
	Gardening,
	HandyMan,
	HomeCleaning,
	Painter
} from '@/components/icons'
import { FC } from 'react'
import { SvgProps } from 'react-native-svg'

export const CATEGORIES_ICONS: Record<string, FC<SvgProps>> = {
	HandyMan: HandyMan,
	Electrician: Electrician,
	ConstructionCleaning: ConstructionCleaning,
	Painter: Painter,
	HomeCleaning: HomeCleaning,
	Gardening: Gardening,
	Flooring: Flooring,
	AirCondition: AirCondition
}

export const getIconForCategory = (iconName: string): FC<SvgProps> | null => {
	if (!iconName) return null
	return CATEGORIES_ICONS[iconName]
}
