<script setup>
	import { computed } from 'vue'
	import { cartStore } from '@/store/cart.js'
	import { dollarRateStore } from '@/store/dollarRate.js'

	const cart = cartStore()
	const dollarRate = dollarRateStore()

	/**
	 * Конвертирование цены из долларов в рубли и форматирование вывода
	 * @param {number} price - Цена в долларах
	 * @return {string}
	 */
	function convertPriceToRubles(price) {
		const priceInRubles = Math.round(100 * dollarRate.rate * price) / 100
		const convertedPrice = new Intl.NumberFormat('fr-Ca').format(priceInRubles)
		return `${convertedPrice} ₽`
	}

	/**
	 * Изменение количества товара в корзине
	 * @param {number} itemId - ID товара
	 * @param {number} count - Количество товара
	 */
	function updateCartItemCount(itemId, count) {
		cart.updateItemCount(itemId, +count)
	}

	// Суммарная стоимость товаров
	const totalSum = computed(() => {
		const sum = Math.round(100 * dollarRate.rate * cart.totalSum) / 100
		return new Intl.NumberFormat('fr-Ca').format(sum) + ' ₽'
	})
</script>


<template lang="pug">
.cart
	h1 Корзина
	table.cartTable
		tr
			th Наименование товара и описание
			th Количество
			th.price Цена
			th
		tr(v-for="cartItem in cart.cart" :key="cartItem.id")
			td {{ cartItem.item.name }}
			td.count #[input(type="number" min="0" :max="cartItem.item.restCount" :title="`Максимум: ${cartItem.item.restCount}`" :value="cartItem.count" @input="updateCartItemCount(cartItem.id, $event.target.value)" @change="updateCartItemCount(cartItem.id, $event.target.value)")] шт.
				.notice(v-if="cartItem.item.restCount < 4" title="Остаток товара меньше четырёх единиц") Количество ограничено
			td.price #[span.value {{ convertPriceToRubles(cartItem.item.price) }}] / шт.
			td
				span.delete(@click="cart.removeFromCart(cartItem.id)") Удалить
	div.totalSum Общая стоимость: #[span.value {{ totalSum }}]
</template>


<style lang="scss" scoped>
.cart { max-width: 800px; }

.cartTable {
	border-collapse: collapse;
	width: 100%;
}

th, td {
	padding: 10px 8px;
	vertical-align: top;
}

tr:not(:last-child) td { border-bottom: 1px solid #eee; }
th {
	border-bottom: 1px solid #eee;
	color: #9f9f9f;
	text-align: left;

	&.price { text-align: right; }
}

td.count {
	color: #888;

	input { width: 60px; }

	.notice {
		margin-top: 4px;
		background-color: #fffaf2;
		color: #f60;
		padding: 4px;
		border: 1px dotted currentColor;
	}
}

.price {
	color: #888;
	white-space: nowrap;
	text-align: right;

	.value {
		font-weight: 500;
		font-size: 1.1em;
		color: #000;
	}
}

.totalSum {
	margin-top: 2em;
	text-align: right;
	color: #999;

	.value {
		color: #f60;
		font-weight: bold;
	}
}

.delete {
	color: #888;
	cursor: pointer;
	user-select: none;
}
</style>