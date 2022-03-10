<script setup>
import { ref } from 'vue'
import Item from '@/components/Item.vue'

const props = defineProps({
	category: Object,
	items: Array
})

let isCollapsed = ref(false)
const numberOfRows = Math.ceil(props.items.length / 2)

/**
 * Получение товара в строке idx
 * @param {number} rowIdx - индекс строки с 1
 * @param {number} positionIdx - индекс позиции товара (0 или 1)
 * @return {object}
 */
function getItemInRow(rowIdx, positionIdx) {
	return props.items?.[2 * (rowIdx - 1) + positionIdx]
}
</script>


<template lang="pug">
.category(:class="{collapsed: isCollapsed}")
	.header(@click="isCollapsed = !isCollapsed")
		span.collapser &lt;
		span {{ category.name }}
	.itemsRow(v-for="idx in numberOfRows" :key="idx")
		Item(:item="getItemInRow(idx, 0)")
		Item(:item="getItemInRow(idx, 1)" v-if="idx < numberOfRows || items.length % 2 == 0")
</template>


<style lang="scss" scoped>
	.category {
		width: 100%;

		&:not(:last-child) { margin-bottom: 12px; }
		&.collapsed {
			.itemsRow { display: none; }
			.collapser { transform: rotate(-90deg); }
		}

		.header {
			background-color: #d2dee2;
			border-top-left-radius: 4px;
			border-top-right-radius: 4px;
			text-align: left;
			padding: 4px 10px;
			cursor: pointer;
			user-select: none;
		}

		.header, .item { border: 1px solid #888; }

		.item {
			border-top: none;

			@media (min-width: 768px) {
				& + .item { border-left: none; }
			}
		}
	}

	.collapser {
		display: inline-block;
		margin-right: 4px;
		transform: rotate(90deg);
		transition: transform 0.15s;
	}

	.itemsRow {
		display: grid;
		grid-template-columns: 1fr  1fr;
	}


	@media (max-width: 767px) {
		.itemsRow { grid-template-columns: 100%; }
	}
</style>