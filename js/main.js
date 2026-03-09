/*source: https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event*/
document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("shopagram_cart")) || [];

  /*local storage for data staying across pages when switching. since localStorage holds just strings I'm using JSON.parse() and JSON.stringify()
  source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API*/
  const saveCart = () => {
    localStorage.setItem("shopagram_cart", JSON.stringify(cart));

    updateCartCount();
  };

  /*making the cart counter on the nav bar global so it updates on all pages*/

  const updateCartCount = () => {
    const countElement = document.getElementById("cart-count");

    /*add all items for total in cart*/
    if (countElement) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      countElement.textContent = totalItems;
    }
  };
  /*initialize the count once page is loaded*/
  updateCartCount();
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        /*using the closest() element to take the product details
        source: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest*/
        const card = event.target.closest(".product-card");
        const productId = event.target.getAttribute("data-id");
        const title = card.querySelector("h3").textContent;
        /*removing the "kr" from the string so the price is just a number so it can be added*/
        const price = parseFloat(
          card.querySelector(".price").textContent.replace("kr", "").trim(),
        );
        /*checking if items already exists and adds 1 to quantity if it does*/
        const addedItemCheck = cart.findIndex((item) => item.id === productId);

        if (addedItemCheck > -1) {
          cart[addedItemCheck].quantity += 1;
        } else {
          /*adding new item to cart array if there is 0*/
          cart.push({ id: productId, title, price, quantity: 1 });
        }
        saveCart();

        const originalText = button.textContent;
        button.textContent = "+1";
        setTimeout(() => (button.textContent = originalText), 1000);
      });
    });
  }
  const cartNumber = document.getElementById("cart-number");
  const cartTotalElement = document.getElementById("cart-total");

  const renderCart = () => {
    if (!cartNumber) return;

    cartNumber.innerHTML = "";
    if (cart.length === 0) {
      cartNumber.innerHTML = "<p>Your Cart is Empty</p>";
      cartTotalElement.textContent = "0.00 kr";
      return;
    }
    let cartTotal = 0;
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      cartTotal += itemTotal;
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `<div class= "item-details"><p><strong>${item.title}</strong></p> <p class = "item-line-total">${itemTotal.toFixed(2)} kr x ${item.quantity}</p></div><p class="item-line-total">${itemTotal.toFixed(2)} kr</p><button class="btn remove-btn" data-id="${item.id}">Remove</button>`;
      cartNumber.appendChild(itemDiv);
    });
    cartTotalElement.textContent = `${cartTotal.toFixed(2)} kr`;
    attachRemoveListeners();
  };
  const attachRemoveListeners = () => {
    const removeButton = document.querySelectorAll(".remove-btn");
    removeButton.forEach((button) => {
      button.addEventListener("click", (event) => {
        const productID = event.target.getAttribute("data-id");

        cart = cart.filter((item) => item.id !== productID);
        saveCart();
        renderCart(); /*rerendering the cart after data changes*/
      });
    });
  };
  renderCart(); /*first render of cart*/
});
