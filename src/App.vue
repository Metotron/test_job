<script setup>
import { ref, computed } from 'vue'
import { loadJSONData } from '@/misc/dataLoaders.js'
import { dollarRateStore } from '@/store/dollarRate.js'
import { lastPricesStore } from '@/store/lastPrices.js'
import { cartStore } from '@/store/cart.js'

import CategoryItems from '@/components/CategoryItems.vue'
import Cart from '@/components/Cart.vue'

// Курс доллара
const dollarRate = dollarRateStore()
const dollarRateMin = dollarRate.rateMin
const dollarRateMax = dollarRate.rateMax

// Цены товаров на момент последнего обращения в формате {[itemId]: цена}
const lastItemsPrices = lastPricesStore()

// Массив категорий из файла
let categories = ref([])
// Массив товаров из файла
let products = ref([])
// Показывать ли пустые категории
let showEmptyCategories = ref(true)

// Доступ к корзине нужен для обновления информации о ценах и остатках товаров
const cart = cartStore()

// Загрузка данных из JSON-файлов и раскладка по переменным
function loadJSON() {
	// Сохраняем предыдущее состояние цен товаров для последующего сравнения
	const pricesToStore = {}

	products.value.forEach(item => {
		pricesToStore[item.id] = Math.round(100 * item.price * dollarRate.rate) / 100
	})
	lastItemsPrices.storeItemsPrices(pricesToStore)

	loadJSONData().then(data => {
		categories.value = data.loadedCategories
		products.value = data.loadedProducts

		cart.refreshCartItems(products.value)

		// Повторная загрузка данных через 15 секунд
		setTimeout(loadJSON, 15000)
		refreshCounter.value = 15
	})
}
loadJSON()

// Обратный отсчёт до обновления данных
const refreshCounter = ref(15)
setInterval(() => {
	refreshCounter.value = Math.max(0, refreshCounter.value - 1)
}, 1000)

/**
 * Получение товаров, принадлежащих категории с указанным id
 * @param {number} categoryId - id категории
 * @return {array}
 */
function getCategoryItems(categoryId) {
	return products.value.filter(product => product.category == categoryId)
}

/**
 * Установка курса доллара
 * @param (number) event - событие input
 * @return (void)
 */
function setDollarRate(event) {
	dollarRate.setRate(event.target.value)
}

const limitedDollarRate = computed(() => Math.min(dollarRate.rateMax, Math.max(dollarRate.rateMin, dollarRate.rate)))
</script>


<template lang="pug">
main
	.options
		fieldset.dollarRate
			legend Курс доллара
			input(
				type="number"
				:value="dollarRate.rate"
				@input="setDollarRate"
				@change="setDollarRate"
				:min="dollarRateMin"
				:max="dollarRateMax"
			)
			| → #[span(title="Используемое значение") {{ limitedDollarRate }}]

		fieldset
			legend Прочие опции
			label
				input(type="checkbox" v-model="showEmptyCategories")
				| Показывать пустые категории
			.refreshCounter Обновление через: {{ refreshCounter }} с.
	hr

	h1 Товары
	CategoryItems(
		v-for="(category, idx) in categories"
		v-show="getCategoryItems(category.id).length || showEmptyCategories"
		:category="category"
		:items="getCategoryItems(category.id)"
		:key="idx"
	)

hr
Cart
</template>


<style lang="scss" scoped>
.options { display: flex; }

fieldset {
	display: inline-block;

	&:not(:last-child) { margin-right: 16px; }

	[type=number] {
		display: inline-block;
		margin-right: 4px;
		width: 60px;
	}

	span { margin-left: 4px; }

	label { cursor: pointer; }

	&.dollarRate {
		display: flex;
		align-items: center;
	}

	.refreshCounter {
		margin-top: 0.4em;
	}
}

hr { margin: 2em 0; }
</style>

<style lans="scss">
* { box-sizing: border-box; }

body {
	margin: 0;
	padding: 20px 24px;
	font-size: 14px;
	background-color: #fff;
	min-height: 100vh;
}
</style>