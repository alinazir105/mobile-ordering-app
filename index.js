import { menuArray } from './data.js'

const menuContainer = document.getElementById("menu-container")
const checkout = document.getElementById("checkout")
const checkoutContent = document.getElementById('checkout-content')
const checkoutBtn = document.getElementById('checkout-btn')
const formContainer = document.getElementById('form-container')
const thanksMsg = document.getElementById('thanks-msg')
const paymentForm = document.getElementById('payment-form')

let orders = []

document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('add-btn')) {
        const itemID = Number(e.target.dataset.id)
        addItemToOrder(itemID)
    } else if (e.target && e.target.classList.contains('remove-btn')) {
        const itemID = Number(e.target.dataset.id)
        removeItemFromOrder(itemID)
    }
    else if(e.target && e.target.classList.contains('checkout-btn')){
        checkout.style.display = 'none'
        formContainer.style.display = 'block'
    }
})


paymentForm.addEventListener('submit', function(e){
    e.preventDefault() // Prevent form submission
    const name = document.getElementById('name-input').value
    formContainer.style.display = 'none'
    thanksMsg.style.display = 'block'
    thanksMsg.innerText = `Thanks ${name}, your order is on its way`
})

function addItemToOrder(itemID) {
    const menuItem = menuArray.find(item => item.id === itemID)

    if (menuItem) {
        const existingOrder = orders.find(order => order.id === itemID)

        if (existingOrder) {
            existingOrder.quantity += 1
            existingOrder.totalPrice += menuItem.price
        } else {
            orders.push({
                ...menuItem,
                quantity: 1,
                totalPrice: menuItem.price
            })
        }

        console.log(orders)
        updateCheckout()
    }
}

function removeItemFromOrder(itemID) {
    orders = orders.filter(order => order.id !== itemID)
    console.log(orders)
    updateCheckout()
}

function updateCheckout() {
    checkoutContent.innerHTML = ''
    if (orders.length > 0) {
        checkout.style.display = 'block'
        checkoutContent.style.display = 'block'
        orders.forEach(order => {
            checkoutContent.innerHTML += `
                <div class="checkout-info">
                    <p>${order.name} (${order.quantity}) <span class="remove-btn" data-id="${order.id}">remove</span></p>
                    <p>$${order.totalPrice}</p>
                </div>`
        })

        const total = orders.reduce(function(total, current){
            return total + current.totalPrice
        },0)
        checkoutContent.innerHTML += `
        <div class="checkout-info" id = "total-price">
                    <p>Total Price: </p>
                    <p>$${total}</p>
                </div>
        <button id="checkout-btn" class="checkout-btn">Checkout</button>`
    } else {
        checkout.style.display = 'none'
        checkoutContent.style.display = 'none'
    }
}

function getMenuHtml() {
    const menuHtml = menuArray.map(function (item) {
        return `
        <section class="item-display">
            <div class="item-emoji">
                <h2>${item.emoji}</h2>
            </div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.ingredients}</p>
                <h4>$${item.price}</h4>
            </div>
            <div class="btn-container">
                <button class="add-btn" data-id="${item.id}">+</button>
            </div>
        </section>`
    }).join('')

    return menuHtml
}

function renderMenu() {
    menuContainer.innerHTML = getMenuHtml()
}

renderMenu()
