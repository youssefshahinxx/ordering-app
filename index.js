import { menuArray } from "./data.js"
const menuEl = document.getElementById('menu')
const cartEl = document.getElementById("cart")
const checkoutEl = document.getElementById("checkout")
const checkoutMessageEl = document.getElementById("checkout-message")
const cartItems = []
let itemPosition = 0
let totalPrice = 0
let TotalQuantity = 0
const formData = new FormData()

class Menu {
    constructor(name, ingredients, price, emoji, id) {
        this.name = name
        this.ingredients = ingredients
        this.price = price
        this.emoji = emoji
        this.id = id
    }

    render() {
        return `
            <div class="menu-item" id="${this.id}">
                <span class="emoji">${this.emoji}</span>
                <div>
                    <h2>${this.name}</h2>
                    <p>${this.ingredients.join(", ")}</p>
                    <p>$${this.price}</p>
                </div>
                <button class="add-btn" type="button" id="btn-${this.id}">+</button>
            </div>
        `
    }
}

class Cart {
    constructor(name, price, quantity, id) {
        this.name = name
        this.price = price
        this.quantity = quantity
        this.id = id
    }

    render() {
        return `
        <div class="cart-item">
                <div class="item-name">
                    <h2>${this.name}</h2>
                    <button class="remove-btn" type="button" id="remove-${this.id}">Remove</button>
                </div>
                <div class="item-name">
                    <p>x ${this.quantity}</p>
                    <p>$${this.price}</p>
                </div>
        </div>
        `
    }
}

function updateCartUI() {
    cartEl.innerHTML = `
        <div class="cart-ui">
            <h1>Your Order</h1>
            ${cartItems.map(item => new Cart(item.name, item.price, item.quantity, item.id).render()).join('')}
        </div>
        <p>Total Quantity: ${TotalQuantity}</p>
        <p>Total: $${totalPrice}</p>
        <button class="checkout-btn" id="checkout-btn" type="button">Complete Order</button>
    `
    cartItems.forEach(item => {
        const button = document.getElementById(`remove-${item.id}`)
        if(button){
            button.addEventListener('click', () => {
                console.log("yes")
                removeItem(item)
                updateCartUI()
            })
        }
    })

    document.getElementById("checkout-btn").addEventListener('click', () => {
        checkoutEl.querySelector("button").classList.remove("hide")
        checkoutEl.querySelector(".cancel-btn").classList.remove("hide")
        setTimeout(() => {
            checkoutEl.querySelector(".checkout-ui").classList.remove("hide")
        }, 600);
    })
}

function checkoutUI() {
    return `
    <div class="checkout-ui hide">
        <h1>Checkout</h1>
        <form id="checkout-form">
            <label for="name">Name:</label>
            <input 
            type="text" 
            name="name"
            placeholder="John Doe" required>
            <label for="email">Email:</label>
            <input 
            type="email" 
            name="email"
            placeholder="JhonDoe@example.com" required>
            <label for="address">Address:</label>
            <input 
            type="text" 
            name="address" 
            placeholder="123 Main St" required>
            <label for="phone">Phone number:</label>
            <input 
            type="tel" 
            name="phone" 
            placeholder="123-456-7890" required>
            <label for="pov">Credit Card Number:</label>
            <input id="pov" type="tel" 
            minlength="19"
            maxlength="19" 
            placeholder="xxxx xxxx xxxx xxxx" required>
            <label for="cvv">CVV:</label>
            <input 
            type="text" 
            name="cvv"
            maxlength="3" 
            placeholder="123" required>
            <button id="submit-btn" type="submit">Complete Order</button>
            <button class="cancel-btn" type="click" id="cancel-btn">Cancel Order</button>
            <img class="hide" src="loading-7528_256.gif" alt="pov">
        </form>
    </div>
    `
}

checkoutEl.innerHTML = checkoutUI()

menuEl.innerHTML = menuArray.map(item => new Menu(item.name, item.ingredients, item.price, item.emoji, item.id).render()).join('')

menuArray.forEach(item => {
    const button = document.getElementById(`btn-${item.id}`)
    if(button){
        button.addEventListener('click', () => {
                addItem(item)
                updateQuantity(item)
                updateCartUI()
        })
    }
})

function updateQuantity(item){
    TotalQuantity += 1
    item.quantity += 1
}

function addItem(item){    
    if(cartItems.includes(item)){
        totalPrice += item.price
        item.price += item.price
    } else {
        item.quantity = 0
        cartItems.push(item)
        itemPosition = cartItems.indexOf(item)
        totalPrice += cartItems[itemPosition].price
    }
} 

function removeItem(item){
    if(cartItems.includes(item) && item.quantity > 1){
        item.price = item.price / 2
        totalPrice -= item.price
        item.quantity -= 1
        TotalQuantity -= 1
    } else if(cartItems.includes(item) && item.quantity === 1){
        totalPrice -= item.price
        cartItems.splice(cartItems.indexOf(item), 1)
        TotalQuantity -= 1
    }
}

const checkoutForm = document.getElementById("checkout-form")

checkoutForm.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.target);

    formData.append("name", checkoutForm.name.value)
    formData.append("email", checkoutForm.email.value)
    formData.append("address", checkoutForm.address.value)
    formData.append("phone", checkoutForm.phone.value)
    formData.append("pov", checkoutForm.pov.value)
    formData.append("cvv", checkoutForm.cvv.value)

    checkoutEl.querySelector("button").classList.add("hide")
    checkoutEl.querySelector(".cancel-btn").classList.add("hide")
    checkoutEl.querySelector("img").classList.remove("hide")

    setTimeout(() => {
        checkoutMessageEl.querySelector(".checkout-message").classList.remove("hide")
        checkoutEl.querySelector("img").classList.add("hide")
        checkoutEl.querySelector(".checkout-ui").classList.add("hide")
        document.getElementById("checkout-btn").classList.add("hide")
        document.getElementById("cart").classList.add("check-color")
    }, 3000);

    checkoutMessageEl.innerHTML = `
    <div class="checkout-message hide">
        <h1>Thanks, ${formData.get("name")}! Your order is on its way.</h1>
    </div>
    `;
})

document.getElementById("cancel-btn").addEventListener('click', () => {
    checkoutEl.querySelector(".checkout-ui").classList.add("hide")

})