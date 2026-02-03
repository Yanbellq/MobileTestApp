import Header from '@/components/layout/Header'
import { PAGES } from '@/config/pages.config'
import { links } from '@/shared/data/navigation.data'
import { Tabs, useRouter } from 'expo-router'

export default function RootLayout() {
	const router = useRouter()

	return (
		<>
			<Header
				actions={[
					{
						label: 'Sign In',
						onPress: () => router.push(PAGES.LOGIN)
					},
					{
						label: 'Sign Up',
						onPress: () => router.push(PAGES.REGISTER)
					}
				]}
			/>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarActiveBackgroundColor: '#50FFA1',
					tabBarActiveTintColor: 'black'
				}}
			>
				{links.map(link => {
					const IconComponent = link.icon
					return (
						<Tabs.Screen
							key={link.name}
							name={link.name}
							options={{
								title: link.label,
								tabBarIcon: ({ size }) => (
									<IconComponent
										width={size}
										height={size}
									/>
								)
							}}
						/>
					)
				})}
			</Tabs>
		</>
	)
}
