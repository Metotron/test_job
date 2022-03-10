import { defineStore } from 'pinia'

export const lastPricesStore = defineStore('pricesStore', {
	state: () => ({
		prices: {}
	}),

	actions: {
		/**
		 * Сохранение последнего состояния цен товаров в рублях
		 * @param {object} pricesData - Объект с ценами
		 */
		storeItemsPrices(pricesData) {
			this.prices = pricesData
		}
	}
})