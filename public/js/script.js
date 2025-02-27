// swiper-images-main
var swiper = new Swiper(".mySwiper", {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
});
var swiper2 = new Swiper(".mySwiper2", {
    spaceBetween: 10,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    thumbs: {
        swiper: swiper,
    },
});
// End swiper-images-main

// alert success
const alertAddCartSusscess = () => {
    const elementAlert = document.querySelector("[alert-add-cart-susscess]");
    if (elementAlert) {
        elementAlert.classList.remove("alert-hidden");

        setTimeout(() => {
            elementAlert.classList.add("alert-hidden");
        }, 3000);
    }
}
//end  alert success

// cart
const cart = localStorage.getItem("cart");
if (!cart) {
    localStorage.setItem("cart", JSON.stringify([]));
}

// hiển thị số lượng tour trong giỏ hàng
const showMiniCart = () => {
    const miniCart = document.querySelector("[mini-cart]");

    if (miniCart) {
        const cart = JSON.parse(localStorage.getItem("cart"));
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        miniCart.innerHTML = totalQuantity;
    }
}
showMiniCart();

// thêm tour vào giỏ hàng
const formAddToCart = document.querySelector("[form-add-to-cart]");
if (formAddToCart) {
    formAddToCart.addEventListener("submit", (e) => {
        e.preventDefault();

        const quantity = parseInt(e.target.elements.quantity.value);
        const tourId = parseInt(formAddToCart.getAttribute("tour-id"));

        if (quantity > 0 && tourId) {
            const cart = JSON.parse(localStorage.getItem("cart"));

            const indexExistTour = cart.findIndex((item) => item.tourId === tourId);

            if (indexExistTour == -1) {
                cart.push({ tourId: tourId, quantity: quantity });
            } else {
                cart[indexExistTour].quantity += quantity;
            }


            localStorage.setItem("cart", JSON.stringify(cart));

            alertAddCartSusscess();
            showMiniCart();
        }
    })
}
// end cart

// alert
document.addEventListener('DOMContentLoaded', function () {
    const alerts = document.querySelectorAll('.alert[show-alert]');

    alerts.forEach(alert => {
        const time = alert.getAttribute('data-time');

        // Show alert with slide-in effect
        setTimeout(() => {
            alert.classList.add('show');
        }, 100);

        setTimeout(() => {
            alert.classList.add('hide');
            setTimeout(() => alert.remove(), 500); // Remove alert after animation ends
        }, time);

    });
});
// end alert