import { Href } from 'expo-router'
import { FC } from 'react'
import { SvgProps } from 'react-native-svg'

export type TNavLink = {
	name: string
	href: Href
	icon: FC<SvgProps>
	label: string
}
