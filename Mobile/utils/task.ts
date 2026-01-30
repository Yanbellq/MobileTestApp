import type { IOffer } from '@/shared/types/offers.interface'
import type { ITask } from '@/shared/types/task.interface'

export const getAcceptedOfferAmount = (
	task: ITask | null,
	offers: IOffer[]
): number => {
	if (!task || !offers.length) return task?.budget ?? 0
	const acceptedOffer = offers.find(o => o.isAssigned)
	return acceptedOffer?.amount ?? task.budget ?? 0
}

// @/utils/task.ts
export function isAssignedWorker(
  task: ITask | null | undefined,
  userId: string | undefined,
  isWorker: boolean,
  offers: IOffer[]
): boolean {
  if (!task || !userId || !isWorker || !offers.length) {
    return false
  }

  // Перевірка 1: Чи є offer з userId юзера і isAssigned === true
  const userOffer = offers.find(
    offer => offer.userId === userId && offer.isAssigned === true
  )

  if (!userOffer) {
    return false
  }

  // Перевірка 2: Чи цей offer призначений на таску (опціонально)
  return task.offer_id === userOffer.id || task.status === 'ASSIGNED'
}
