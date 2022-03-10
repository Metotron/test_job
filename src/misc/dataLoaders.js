const loadedCategories = []
const loadedItemsStore = []
let loadedProducts

/**
 * Загрузка списка категорий и товаров в них
 */
function loadCategoriesAndStore() {
	loadedCategories.splice(0)
	loadedItemsStore.splice(0)

	return fetch('/names.json')
		.then(data => data.json())
		.then(namesCategories => {
			for (const categoryId in namesCategories) {
				loadedCategories.push({
					id: categoryId,
					name: namesCategories[categoryId]?.G || '[без имени]'
				})

				// Составдение списка товаров в виде {id, name}
				const loadedItems = namesCategories[categoryId]?.B
				if (!loadedItems) {
					return 0
				}

				for (const itemId in loadedItems) {
					loadedItemsStore.push({
						id: itemId,
						name: loadedItems[itemId]?.N || '[без имени]'
					})
				}
			}
		})
}

/**
 * Загрузка цен и остатков
 */
function loadProducts() {
	return fetch('/data.json')
		.then(data => data.json())
		.then(productsJSON => {
			const goods = productsJSON?.Value?.Goods
			if (!goods) {
				return 0
			}

			loadedProducts = goods.map(item => ({
				id: item.T,
				restCount: item.P,
				category: item.G,
				price: item.C,
				name: getItemName(item.T)
			}))
		})
}

/**
 * Получение имени товара по ID
 * @param {number} itemId - id товара
 * @return {string}
 */
function getItemName(itemId) {
	const itemName = loadedItemsStore.find(item => item.id == itemId)
	return itemName?.name || '[без имени]'
}

async function loadJSONData() {
	await loadCategoriesAndStore()
	await loadProducts()
	return {
		loadedCategories,
		loadedProducts
	}
}

export { loadJSONData }