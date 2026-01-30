import { assignOffer, completeTask, createOffer, payTask } from '@/lib/offer'
import { deleteTask, unassignTask } from '@/lib/task'
import { getTaskAge } from '@/utils/date'
import { getAcceptedOfferAmount, isAssignedWorker } from '@/utils/task'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { useTaskDetails } from './useTaskDetails'

export function useTaskDetailsLogic(taskId: number | undefined) {
	const router = useRouter()
	const { user } = useAuth()
	const { task, loading, error, refetch } = useTaskDetails(taskId)
	// Use offers from task instead of separate API call
	const offers = useMemo(() => task?.offers ?? [], [task?.offers])

	console.log('DEBUG useTaskDetailsLogic: TASK -> ', task)
	console.log('DEBUG useTaskDetailsLogic: OFFERS -> ', offers)
	const offersLoading = loading

	const [finalPrice, setFinalPrice] = useState<number | null>(null)
	const [isEditingPrice, setIsEditingPrice] = useState(false)
	const [priceInput, setPriceInput] = useState('')
	const [submittingBid, setSubmittingBid] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [offerSuccess, setOfferSuccess] = useState(false)
	const [assigningOffer, setAssigningOffer] = useState<number | null>(null)
	const [completingTask, setCompletingTask] = useState(false)
	const [payingTask, setPayingTask] = useState(false)

	// User role and permissions
	const isEmployer = user?.profile?.role === 'EMPLOYER'
	const isMyTask = task && user && task.authorId === user.id
	const isWorker = user?.profile?.role === 'WORKER'
	const assignedWorker = useMemo(
		() => isAssignedWorker(task, user?.id, isWorker, offers),
		[task, user?.id, isWorker, offers]
	)

	const hasApplied = useMemo(() => {
		if (!user || !offers.length) return false
		return offers.some(offer => offer.userId === user.id) // ✅ Використовуємо camelCase
	}, [user, offers])

	const acceptedOffer = useMemo(() => {
		if (!task?.offer_id || !offers.length) return null
		return offers.find(o => o.id === task.offer_id) || null
	}, [task?.offer_id, offers])
	const acceptedOfferLoading = offersLoading || loading

	// DEBUG
	useEffect(() => {
		console.log('DEBUG useTaskDetailsLogic:', {
			isEmployer,
			isMyTask,
			isWorker,
			offers: offers.length,
			assignedWorker,
			user_id: user?.id,
			author_id: task?.authorId,
			task_status: task?.status,
			showOffers: isEmployer && isMyTask && offers.length > 0,
			showTaskAssignedToOthers:
				isWorker &&
				!assignedWorker &&
				(task?.status === 'ASSIGNED' ||
					task?.status === 'APPLIED' ||
					task?.status === 'COMPLETED'),
			offers_data: offers.map(o => ({
				id: o.id,
				user_id: o.userId,
				is_assigned: o.isAssigned,
				task_id: o.taskId
			}))
		})
	}, [
		isEmployer,
		isMyTask,
		isWorker,
		offers.length,
		assignedWorker,
		user?.id,
		task?.authorId,
		task?.status,
		offers
	])

	// Visibility flags
	const visibility = useMemo(
		() => ({
			showOffers: !!(isEmployer && isMyTask && offers.length > 0),
			showBidSection: !!(
				isWorker &&
				!!user &&
				!assignedWorker &&
				!hasApplied &&
				task?.status === 'OPEN'
			),
			showAppliedSection: !!(
				isWorker &&
				!!user &&
				!assignedWorker &&
				hasApplied &&
				task?.status === 'OPEN'
			),
			showWorkerSection: !!(isEmployer && isMyTask && task?.status !== 'OPEN'),
			showAssignedWorkerSection: !!(
				assignedWorker && task?.status === 'ASSIGNED'
			),
			showPaySection: !!(isEmployer && isMyTask && task?.status === 'APPLIED'),
			showCompletedBadge: task?.status === 'COMPLETED',
			showTaskAssignedToOthers: !!(
				isWorker &&
				!assignedWorker &&
				(task?.status === 'ASSIGNED' ||
					task?.status === 'APPLIED' ||
					task?.status === 'COMPLETED')
			)
		}),
		[isEmployer, isMyTask, isWorker, user, assignedWorker, task, hasApplied]
	)

	// Computed values
	const computed = useMemo(
		() => ({
			ageLabel: getTaskAge(task?.createdAt),
			locationLine: [task?.location, task?.address].filter(Boolean).join('\n'),
			displayedPrice:
				task?.status === 'ASSIGNED' || task?.status === 'COMPLETED'
					? getAcceptedOfferAmount(task, offers)
					: (finalPrice ?? task?.budget ?? 0),
			acceptedOfferAmount: getAcceptedOfferAmount(task, offers)
		}),
		[task, finalPrice, offers]
	)

	useEffect(() => {
		if (task) {
			setFinalPrice(task.budget)
			setPriceInput(String(task.budget))
		}
	}, [task?.id])

	const refreshTask = () => {
		router.back()
		setTimeout(() => {
			router.push(`/task/${taskId}`)
		}, 100)
	}

	const handleSavePrice = () => {
		const parsed = Number(priceInput.replace(/[^\d.]/g, ''))
		if (!Number.isNaN(parsed)) {
			setFinalPrice(parsed)
		}
		setIsEditingPrice(false)
	}

	const handleSubmitBid = async () => {
		if (!user || !taskId) return
		const amount = finalPrice ?? task?.budget ?? null
		if (!amount || Number.isNaN(amount)) {
			setSubmitError('Enter a valid price before submitting.')
			return
		}

		try {
			setSubmittingBid(true)
			setSubmitError(null)
			await createOffer({
				taskId,
				userId: user.id,
				amount: Math.round(amount)
			})
			setOfferSuccess(true)
			setIsEditingPrice(false)
		} catch (err: any) {
			setSubmitError(err?.message ?? 'Failed to submit offer')
		} finally {
			setSubmittingBid(false)
		}
	}

	const handleAssignOffer = async (offerId: number) => {
		if (!taskId) return
		try {
			setAssigningOffer(offerId)
			await assignOffer(taskId, offerId)
			refreshTask()
		} catch (err: any) {
			console.error('Failed to assign offer', err)
		} finally {
			setAssigningOffer(null)
		}
	}

	const handleCompleteTask = async () => {
		if (!taskId) return
		try {
			setCompletingTask(true)
			await completeTask(taskId)
			refreshTask()
		} catch (err: any) {
			console.error('Failed to complete task', err)
		} finally {
			setCompletingTask(false)
		}
	}

	const handlePayTask = async () => {
		if (!taskId) return
		try {
			setPayingTask(true)
			await payTask(taskId)
			refreshTask()
		} catch (err: any) {
			console.error('Failed to pay task', err)
		} finally {
			setPayingTask(false)
		}
	}

	const handleDeleteTask = async () => {
		if (!taskId) return
		try {
			await deleteTask(taskId)
			router.back()
		} catch (err: any) {
			console.error('Failed to delete task', err)
		}
	}

	const handleUnassignTask = async () => {
		if (!taskId) return
		try {
			await unassignTask(taskId)
			refreshTask()
		} catch (err: any) {
			console.error('Failed to unassign task', err)
		}
	}

	return {
		// Data
		task,
		offers,
		loading,
		error,
		offersLoading,
		acceptedOffer,
		acceptedOfferLoading,
		// State
		priceState: {
			finalPrice,
			isEditingPrice,
			priceInput,
			displayedPrice: computed.displayedPrice
		},
		bidState: {
			submittingBid,
			submitError,
			offerSuccess
		},
		actionState: {
			assigningOffer,
			completingTask,
			payingTask
		},
		// Computed
		computed,
		visibility,
		// Handlers
		handlers: {
			onPriceInputChange: setPriceInput,
			onSavePrice: handleSavePrice,
			onCancelEdit: () => setIsEditingPrice(false),
			onStartEdit: () => {
				setPriceInput(String(computed.displayedPrice))
				setIsEditingPrice(true)
			},
			onSubmitBid: handleSubmitBid,
			onAssignOffer: handleAssignOffer,
			onCompleteTask: handleCompleteTask,
			onPayTask: handlePayTask,
			onDeleteTask: handleDeleteTask,
			onUnassignTask: handleUnassignTask
		},
		isOwner: isEmployer && isMyTask,
		isAssigned: assignedWorker
	}
}
