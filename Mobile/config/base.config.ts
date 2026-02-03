import { API_KEY } from './key.config'

export const GOOGLE_AUTOCOMPLETE = {
	ADDRESS: {
		key: API_KEY.GOOGLE,
		language: 'en',
		types: 'address'
	},
	CITY: {
		key: API_KEY.GOOGLE,
		language: 'en',
		types: '(cities)'
	}
}
