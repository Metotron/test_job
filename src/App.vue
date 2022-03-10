<script setup>
import { ref, computed } from 'vue'
import { loadJSONData } from '@/misc/dataLoaders.js'
import { dollarRateStore } from '@/store/dollarRate.js'

import CategoryItems from '@/components/CategoryItems.vue'
import Cart from '@/components/Cart.vue'

// Курс доллара
const dollarRate = dollarRateStore()
const dollarRateMin = dollarRate.rateMin
const dollarRateMax = dollarRate.rateMax

// Массив категорий из файла
let categories = ref([])
// Массив товаров из файла
let products = ref([])
// Показывать ли пустые категории
let showEmptyCategories = ref(true)

// Загрузка данных из JSON-файлов и раскладка по переменным
function loadJSON() {
	loadJSONData().then(data => {
		categories.value = data.loadedCategories
		products.value = data.loadedProducts

		// Повторная загрузка данных
		setTimeout(loadJSON, 15000)
	})
}
loadJSON()

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

		label { cursor: pointer; }

		&.dollarRate {
			display: flex;
			align-items: center;
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