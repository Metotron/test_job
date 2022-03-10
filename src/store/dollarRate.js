import { defineStore } from 'pinia'

export const dollarRateStore = defineStore('dollarRate', {
	state: () => ({
		rate: 150,
		rateMin: 20,
		rateMax: 200
	}),

	actions: {
		setRate(value) {
			this.rate = +value
		},
	},
})