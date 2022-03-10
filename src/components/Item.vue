<script setup>
	import { computed } from 'vue'
	import { dollarRateStore } from '@/store/dollarRate.js'
	import { cartStore } from '@/store/cart.js'

	const props = defineProps({
		item: Object
	})

	const dollarRate = dollarRateStore()
	const limitedDollarRate = computed(() => Math.min(dollarRate.rateMax, Math.max(dollarRate.rateMin, dollarRate.rate)))
	const priceInRubles = computed(() => {
		let price = Math.round(100 * props.item.price * limitedDollarRate.value) / 100
		return new Intl.NumberFormat('fr-Ca').format(price)
	})

	// Работа с корзиной
	const cart = cartStore()
	const isItemInCart = computed(() => !!cart.cart.find(cartItem => cartItem.id == props.item.id))

	function addOrRemoveFromCart() {
		if (isItemInCart.value) {
			cart.removeFromCart(props.item.id)
		}
		else {
			cart.addToCart(props.item)
		}
	}
</script>

<template lang="pug">
.item(
	v-if="item"
	:title="`id: ${item.id}`"
	:class="{inCart: isItemInCart}"
	@click="addOrRemoveFromCart"
)
	span.name {{ item.name }} ({{ item.restCount }})
	span.price(:title="item.price") {{ priceInRubles }} ₽
</template>


<style lang="scss" scoped>
	.item {
		display: grid;
		grid-template-columns: 1fr 100px;
		cursor: pointer;

		&.inCart {
			background-color: #ecdfa8;

			.price { background-color: #e1d5a0; }
		}
	}

	.name, .price {
		padding: 10px 16px;
	}

	.price {
		background-color: #f3f3f3;
		text-align: right;
		white-space: nowrap;
	}
</style>
