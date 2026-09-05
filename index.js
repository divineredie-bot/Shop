console.log(GOODS)

let activeTabId = 'goods';

const initialTab = getActiveTab();

initialTab.classList.add('active');

renderTabContentById(activeTabId);
let count = 0;


// ---

const goodsInCart = [];

const tabWithCounter = document.querySelector(
	'button[data-goods-count]'
);

const tabs = document.querySelectorAll('button.tab');
addClickListeners(tabs, clickHandler);

// ---

function clickHandler(event) {
	const activeTab = getActiveTab();	

	activeTab.classList.remove('active');
	event.target.classList.add('active');

	activeTabId = event.target.dataset.tabId;

	removeActiveTabContent();
	renderTabContentById(activeTabId);
}

function addInCartHandler(product) {
	return (event) => {
		if(product.count === undefined){
			product.count = 1;
			goodsInCart.push(product);
		}else{
			product.count++;
		}
		count++;
		tabWithCounter.dataset.goodsCount = count;
		bumpCartCounter();

		const button = event.currentTarget;
		const productCard = button.closest('.product-item');

		if (productCard) {
			animateProductCard(productCard);
			animateProductFlyToCart(productCard);
		}

		showAddedPopup();
	}
}

function addClickListeners(elements, callback) {
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];

		element.addEventListener('click', callback);
	}
}

function createProduct(product) {
	return {
		name: product.name ? product.name : 'Имя не добавлено',
		price: product.price ? product.price : null,
		imgSrc: product.imgSrc ? product.imgSrc : 'goods/default.png'
	};
}

function getActiveTab() {
	return document.querySelector(
		`button[data-tab-id="${activeTabId}"]`
	);
}

function removeActiveTabContent() {
	const activeContent = document.querySelector(
		`[data-active-tab-content="true"]`
	);

	activeContent.remove();
}

function renderTabContentById(tabId) {
	const tabsContainer = document.querySelector('.tabs');

	let html = '';

	if (tabId === 'goods') {
		html = renderGoods();
		tabsContainer.after(html);
	}
	else {
		html = renderCart();
		document.body.append(html);
	}

	
}

function renderGoods() {
	const div = document.createElement('div');
	div.dataset.activeTabContent = 'true';
	div.className = 'product-items';

	

	
	for (let i = 0; i < GOODS.length; i++) {
		const product = createProduct(GOODS[i]);
		const clickHandler = addInCartHandler(product)

		const button = document.createElement('button');
		button.className = 'button';
		button.textContent = 'В корзину';
		button.addEventListener('click', clickHandler);
		const price = product.price === null ? 'Товар закончился' : `<p class="price">${product.price} ₽</p>`
		
		const productBlock = document.createElement('div');
		productBlock.className = 'product-item';
		productBlock.innerHTML = `<img src = "${product.imgSrc}">
			<div class = "product-list">
			<h3>${product.name}</h3>
			${price}
			
			</div>`

		productBlock.querySelector('.product-list').append(button);
		div.append(productBlock);
	}

	return div;

}

function renderCart() {

	console.log(goodsInCart);

	const cartItems = document.createElement('div');
	cartItems.dataset.activeTabContent = "true";
	cartItems.className = 'cart-items';

	console.log(cartItems);

	let sumTotal = goodsInCart.reduce((count, {price})=>{
		return count + price;
	}, 0)
	console.log(sumTotal);

	goodsInCart.forEach(({name, count, price})=>{
		const cartItem = document.createElement('div');
		cartItem.className = 'cart-item';
		cartItem.insertAdjacentHTML('beforeend', `
			<div class="cart-item-title">${name}</div>
			<div class="cart-item-count">${count} шт.</div>
 			<div class="cart-item-price">${price}₽ за шт.</div>
		`)
		cartItems.append(cartItem);
	})

	const totalPrice = document.createElement('div');
	totalPrice.className = 'cart-total-price';
	totalPrice.textContent = `Итого: ${sumTotal}₽`;
	totalPrice.style.fontWeight = 600;
	totalPrice.style.fontSize = '30px';
	cartItems.append(totalPrice);

	return cartItems;
}

function showAddedPopup() {
	const popup = document.createElement('div');
	popup.className = 'cart-popup';
	popup.textContent = 'Добавлено ✓';
	document.body.append(popup);

	requestAnimationFrame(() => {
		popup.classList.add('visible');
	});

	setTimeout(() => {
		popup.classList.remove('visible');
		popup.addEventListener('transitionend', () => popup.remove(), { once: true });
	}, 1400);
}

function bumpCartCounter() {
	tabWithCounter.classList.remove('cart-bump');
	void tabWithCounter.offsetWidth;
	tabWithCounter.classList.add('cart-bump');
}

function animateProductCard(productCard) {
	productCard.classList.remove('product-item-added');
	void productCard.offsetWidth;
	productCard.classList.add('product-item-added');
}

function animateProductFlyToCart(productCard) {
	const image = productCard.querySelector('img');

	if (!image) {
		return;
	}

	const imageRect = image.getBoundingClientRect();
	const cartRect = tabWithCounter.getBoundingClientRect();
	const flyingImage = image.cloneNode(true);

	flyingImage.className = 'flying-product';
	flyingImage.style.width = `${imageRect.width}px`;
	flyingImage.style.height = `${imageRect.height}px`;
	flyingImage.style.left = `${imageRect.left + window.scrollX}px`;
	flyingImage.style.top = `${imageRect.top + window.scrollY}px`;
	flyingImage.style.setProperty('--fly-x', `${cartRect.left + cartRect.width / 2 - (imageRect.left + imageRect.width / 2)}px`);
	flyingImage.style.setProperty('--fly-y', `${cartRect.top + cartRect.height / 2 - (imageRect.top + imageRect.height / 2)}px`);

	document.body.append(flyingImage);
	flyingImage.addEventListener('animationend', () => flyingImage.remove(), { once: true });
}
