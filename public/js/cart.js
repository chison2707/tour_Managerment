// vẽ ra ds tour
const drawListTour = () => {
    fetch("http://localhost:3000/cart/list-json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: localStorage.getItem("cart")
    })
        .then(res => res.json())
        .then(data => {
            const htmlsArray = data.tours.map((item, index) => {
                return `
                <tr>
                    <td>${index + 1}</td>
                    <td><img src="${item.image}" alt="${item.infor.title}" width="80px" /></td>
                    <td><a href="/tours/detail/${item.infor.slug}">${item.infor.title}</a></td>
                    <td>${item.price_special.toLocaleString()}đ</td>
                    <td><input type="number" name="quantity" value="${item.quantity}" min="1" item-id="${item.infor.id}" style="width: 60px;" /></td>
                    <td>${item.total.toLocaleString()}đ</td>
                    <td><button class="btn btn-sm btn-danger" btn-delete="${item.infor.id}">Xóa</button></td>
                </tr>
                `
            });

            const listTour = document.querySelector("[list-Tour]");
            listTour.innerHTML = htmlsArray.join("");

            // tính tổng đơn hàng
            const totalPrice = data.tours.reduce((sum, item) => sum + item.total, 0);
            const elementTotalPrice = document.querySelector("[total-price]");
            elementTotalPrice.innerHTML = totalPrice.toLocaleString();

            deleteItemInCart();

            updateQuantityInCart();
        })
}
// end vẽ ra ds tour

// xóa sản phẩm trong giỏ hàng
const deleteItemInCart = () => {
    const listBtnDelete = document.querySelectorAll("[btn-delete]");
    listBtnDelete.forEach(button => {
        button.addEventListener("click", () => {
            const tourId = button.getAttribute("btn-delete");
            const cart = JSON.parse(localStorage.getItem("cart"));
            const newCart = cart.filter(item => item.tourId != tourId);
            localStorage.setItem("cart", JSON.stringify(newCart));
            drawListTour();
        });
    })
}
//end xóa sản phẩm trong giỏ hàng

// cập nhật số lượng trong giỏ hàng
const updateQuantityInCart = () => {
    const listBtnDelete = document.querySelectorAll("[list-tour] input[item-id]");
    listBtnDelete.forEach(input => {
        input.addEventListener("change", () => {
            const tourId = input.getAttribute("item-id");
            const quantity = parseInt(input.value);

            const cart = JSON.parse(localStorage.getItem("cart"));
            const tourUpdate = cart.find(item => item.tourId == tourId);
            tourUpdate.quantity = quantity;

            localStorage.setItem("cart", JSON.stringify(cart));
            drawListTour();
        });
    })
}
//end cập nhật số lượng trong giỏ hàng

// lấy data in ra giao diện
drawListTour();
// end lấy data in ra giao diện

// Đặt tour
const formOrder = document.querySelector("[form-order]");
if (formOrder) {
    formOrder.addEventListener("submit", (e) => {
        e.preventDefault();

        const fullName = e.target.elements.fullName.value;
        const phone = e.target.elements.phone.value;
        const note = e.target.elements.note.value;

        const cart = JSON.parse(localStorage.getItem("cart"));

        const data = {
            info: {
                fullName,
                phone,
                note
            },
            cart: cart
        };

        fetch("/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
    });
}

// Hết đặt tour