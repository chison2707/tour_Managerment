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

// lấy data in ra giao diện
drawListTour();
// end lấy data in ra giao diện