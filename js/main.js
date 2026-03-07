/*source: https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event*/
document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("shopagram_cart")) || [];
  
  /*source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API*/
  const saveCart = () => {
    localStorage.setItem("shopagram_cart", JSON.stringify(cart));
    
    updateCartCount();
  };

  const updateCartCount = () => {
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    countElement.textContent = totalItems;
  };
};
updateCartCount();

const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
if (addToCartButtons.length > 0) {
    addToCartButtons.forEach (button => {
        button.addEventListener ('click', (event) =>{
            const card = event.target.closest('.product-card');
            const productId = event.target.getAttribute('data-id');
            const title = card.querySelector('h2').textContent;
            const price = parseFloat(card.querySelector('.price').textContent.replace('', 'kr'));
            const existingItemCheck = cart.findItem(item =>item.id === productId);

            if (existingItemCheck > -1) {
                cart[existingItemCheck].quantity +=1;
            } else{
                cart.push ({id: productId, title, price, quantity: 1});
            }
            saveCart();
            
            const originalText = button.textContent;
            button.textContent = "Added to Cart!";
            setTimeout(()=> button.textContent = originalText, 1000);
        });
    });
}
const cartNumber = document.getElementById('cart-number');
const cartTotalElement = document.getElementById ('cart-total');

const renderCart = () =>{
    if (!cartNumber) return;

    cartNumber.innerHTML = '';
    if (cart.length === 0 ) {
        cartNumber.innerHTML = '<p>Your Cart is Empty</p>';
        cartTotalElement.textContent = '0.00 kr';
        return;
    }
    let cartTotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal +=itemTotal;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `<div class= "item-details"><p><strong>${item.title}</strong></p> <p class = "item-line-total">$${itemTotal.toFixed (2)}x ${item.quantity}</p></div><p class="item-line-total">$${itemTotal.toFixed(2)}</p><button class="btn remove-btn" data-id="${item.id}">Remove</button>`;
        cartNumber.appendChild(itemDiv);
    });
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`
    attachRemoveListeners ();
};
);
