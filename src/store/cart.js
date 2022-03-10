import { defineStore } from 'pinia'

export const cartStore = defineStore('cart', {
	state: () => ({
		cart: []
	}),

	actions: {
		/**
		 * Добавление товара в корзину
		 * @oaram {object} item - Объект товара, описанный в @/misc/dataLoaders.js
		 */
		addToCart(item) {
			const itemInCart = this.cart.find(cartItem => cartItem.id == item.id)
			if (!itemInCart) {
				this.cart.push({
					id: item.id,
					count: 1,
					item: item
				})
			}
		},

		/**
		 * Удаление товара из корзины
		 * @param {number} itemId - ID товара для удаления
		 */
		removeFromCart(itemId) {
			const cartItemIndex = this.cart.findIndex(cartItem => cartItem.id == itemId)
			if (cartItemIndex >= 0) {
				this.cart.splice(cartItemIndex, 1)
			}
		},

		/**
		 * Изменение количества добавленного в корзину единиц товара
		 * @param {number} itemId - ID товара
		 * @param {number} count - Количество единиц товара
		 */
		updateItemCount(itemId, count) {
			console.info(itemId, count)
			const cartItemIndex = this.cart.findIndex(cartItem => cartItem.id == itemId)
			if (-1 === cartItemIndex) {
				return 0
			}

			// Если количество равно нулю, то это удаление
			if (count < 1) {
				this.cart.splice(cartItemIndex, 1)
				return 0
			}

			this.cart[cartItemIndex].count = count
		}
	},

	getters: {
		totalSum(state) {
			return state.cart.reduce((sum, cartEntity) => sum + cartEntity.item.price * cartEntity.count, 0)
		}
	}
})