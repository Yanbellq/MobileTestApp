import { Href } from 'expo-router'

export const createHref = (
	path: Href,
	params?: Record<string, string>
): Href => {
	if (!params) return path as Href

	const query = new URLSearchParams(params).toString()
	return `${path}?${query}` as Href
}
