import { useLocalSearchParams, useRouter } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { TaskDetailsContent } from '@/components/pages/task/TaskDetailsContent'
import { TaskDetailsError } from '@/components/pages/task/TaskDetailsError'
import { TaskDetailsHeader } from '@/components/pages/task/TaskDetailsHeader'
import { TaskDetailsLoading } from '@/components/pages/task/TaskDetailsLoading'
import { useTaskDetailsLogic } from '@/hooks/useTaskDetailsLogic'
import { createHref } from '@/utils/href'
import { PAGES } from '@/config/pages.config'
import { getErrorMessage } from '@/utils/error'

export default function TaskDetailsScreen() {
	const { id } = useLocalSearchParams<{ id?: string }>()
	const router = useRouter()
	const numericId = id ? Number(id) : undefined

	const {
		task,
		offers,
		loading,
		error,
		acceptedOffer,
		acceptedOfferLoading,
		offersLoading,
		priceState,
		bidState,
		actionState,
		computed,
		visibility,
		isOwner,
		isAssigned,
		handlers
	} = useTaskDetailsLogic(numericId)

	const renderBody = () => {
		if (!numericId) {
			return (
				<TaskDetailsError
					message="Invalid task id"
					onGoBack={router.back}
				/>
			)
		}

		if (loading) {
			return <TaskDetailsLoading />
		}

		if (error || !task) {
			return (
				<TaskDetailsError
					message={error ? getErrorMessage(error) : 'Task not found'}
					onGoBack={router.back}
				/>
			)
		}

		return (
			<TaskDetailsContent
				task={task}
				offers={offers}
				offersLoading={offersLoading}
				acceptedOffer={acceptedOffer}
				acceptedOfferLoading={acceptedOfferLoading}
				computed={computed}
				visibility={visibility}
				priceState={priceState}
				bidState={bidState}
				actionState={actionState}
				handlers={handlers}
			/>
		)
	}

	return (
		<View style={styles.screen}>
			<TaskDetailsHeader
				taskStatus={task?.status}
				onBack={() => router.back()}
				isOwner={!!isOwner}
				isAssigned={!!isAssigned}
				onDelete={handlers.onDeleteTask}
				onUnassign={handlers.onUnassignTask}
				onEdit={() =>
					router.push(
						{
							pathname: '/add-tasks',
							params: { taskId: String(numericId), isEdit: 'true' }
						}
						// createHref(
						// 	PAGES.ADD_TASK, {
						// 		taskId: String(numericId),
						// 		isEdit: 'true'
						// 	}
						// )
					)
				}
			/>
			{renderBody()}
		</View>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#F4F7FB'
	}
})
