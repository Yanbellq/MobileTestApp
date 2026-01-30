import { StyleSheet, Text, View } from 'react-native'

const Messages = () => {
	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<View style={styles.headerTopRow}>
					<Text style={styles.pageTitle}>Coming Soon</Text>
				</View>
			</View>

			<View style={styles.emptyState}>
				<Text style={styles.emptyStateText}>Messaging feature coming soon</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F3F5F9'
	},
	headerContainer: {
		paddingHorizontal: 24,
		paddingVertical: 16,
		backgroundColor: '#012333',
		borderBottomWidth: 1,
		borderBottomColor: '#081F2C'
	},
	headerTopRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8
	},
	pageTitle: {
		fontSize: 24,
		fontWeight: '800',
		color: '#EFFFF7'
	},
	emptyState: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24
	},
	emptyStateText: {
		fontSize: 18,
		color: '#6C7A89',
		textAlign: 'center'
	}
})

export default Messages
