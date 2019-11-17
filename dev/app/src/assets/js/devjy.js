// product list in JSON format
var product_json = `{
    "1": {"img": "iphone8.jpeg","name": "iPhone 8","price": "Ξ5", "seller": "cheesecat47", "status": "배송중"},
    "2": {"img": "iphone11.jpeg","name": "iPhone 11","price": "Ξ6.5", "seller": "cheesecat47", "status": "판매중"},
    "3": {"img": "product-03.jpg","name": "조끼 뒷모습","price": "Ξ2", "seller": "atg0831", "status": "판매완료"},
    "4": {"img": "iphoneXR.jpeg","name": "iPhone XR","price": "Ξ5.5", "seller": "cheesecat47", "status": "발송대기"},
    "5": {"img": "product-05.jpg","name": "귀 두 개 가방","price": "Ξ3", "seller": "atg0831", "status": "판매중"},
    "6": {"img": "product-06.jpg","name": "토끼 귀 가방","price": "Ξ3.5", "seller": "cheesecat47", "status": "판매중"},
    "7": {"img": "iphone8.jpeg","name": "iPhone 8","price": "Ξ5", "seller": "atg0831", "status": "판매중"},
    "8": {"img": "iphone11.jpeg","name": "iPhone 11","price": "Ξ6.5", "seller": "cheesecat47", "status": "발송 대기"},
    "9": {"img": "iphoneXR.jpeg","name": "iPhone XR","price": "Ξ5.5", "seller": "atg0831", "status": "판매중"}
}`;

// my account information
var my_account = `{
    "id": "cheesecat47",
    "selling": [1,2,4,6,8],
    "wish": [5, 9],
    "buy_history": [3]
}`;

// main function
$(function () {
    // insert navbar
    fill_nav();

    // handle regist-item btn
    var btn_regist_item = $('#regist-item');
    btn_regist_item.click(function (event) {
        location.href = "addProduct.html";
    });

    // handle regist-item btn
    var btn_order_item = $('#order_item_btn');
    btn_order_item.click(function (event) {
        var order_data = document.order_form;
        console.log(order_data)
        var buyer_name = order_data.buyer_name.value;
        var buyer_address = order_data.buyer_address.value;
        var buyer_contact = order_data.buyer_contact.value;
        
        if (!buyer_name){
            alert("이름을 입력해주세요.");
            return;
        }
        if (!buyer_address){
            alert("주소를 입력해주세요.");
            return;
        }
        if (!buyer_contact){
            alert("연락처를 입력해주세요.");
            return;
        }

        alert(buyer_name + '\n' + buyer_address + '\n' + buyer_contact);
    });
});


function fill_nav() {
    // insert navbar
    var nav = document.getElementById('navbar');
    var innerbox = document.createElement('div');
    innerbox.className = 'container';
    innerbox.innerHTML = `
        <a class="navbar-brand" href="#"><img src="assets/images/header-logo.png" alt=""></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="index.html">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="buy.html">구매하기</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="sell.html">판매하기
                        <span class="sr-only">(current)</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">고객센터</a>
                </li>
            </ul>
        </div>
    `;
    nav.appendChild(innerbox);
}


// function fill_list(listname) {
//     // read json data
//     account = JSON.parse(my_account);
//     obj = JSON.parse(product_json);

//     // insert selling items list
//     var div_list = document.getElementById(listname);

//     if (listname == 'selling-list' || listname == 'request-list') {
//         // iterate to get each information in product list
//         for (acc_idx in account['selling']) {
//             idx = account.selling[acc_idx]

//             if (listname == 'request-list') {
//                 if (obj[idx].status == '판매중' || obj[idx].status == '판매완료') {
//                     continue;
//                 }
//             }

//             var innerbox = document.createElement('div');
//             innerbox.id = idx;
//             innerbox.className = 'item new col-md-4';
//             innerbox.innerHTML = `
//                 <a href="single-product.html">
//                 <div class="featured-item">
//                     <img src="assets/images/${obj[idx].img}" alt="No image">
//                     <h4>${obj[idx].name}</h4>
//                     <h6>Price: ${obj[idx].price}</h6>
//                     <h6>Status: ${obj[idx].status}</h6>
//                 </div>
//                 </a>
//                 `;
//             div_list.appendChild(innerbox);
//         }
//     } // if selling or request list
//     else if (listname == 'wish-list') {
//         for (acc_idx in account['wish']) {
//             idx = account.wish[acc_idx]

//             var innerbox = document.createElement('div');
//             innerbox.id = idx;
//             innerbox.className = 'item new col-md-4';
//             innerbox.innerHTML = `
//                 <a href="single-product.html">
//                 <div class="featured-item">
//                     <img src="assets/images/${obj[idx].img}" alt="No image">
//                     <h4>${obj[idx].name}</h4>
//                     <h6>Seller: ${obj[idx].seller}</h6>
//                     <h6>Price: ${obj[idx].price}</h6>
//                 </div>
//                 </a>
//                 `;
//             div_list.appendChild(innerbox);
//         }
//     } // else if wish list
//     else if (listname == 'buy-history-list') {
//         for (acc_idx in account['buy_history']) {
//             idx = account.wish[acc_idx]

//             var innerbox = document.createElement('div');
//             innerbox.id = idx;
//             innerbox.className = 'item new col-md-4';
//             innerbox.innerHTML = `
//                 <a href="single-product.html">
//                 <div class="featured-item">
//                     <img src="assets/images/${obj[idx].img}" alt="No image">
//                     <h4>${obj[idx].name}</h4>
//                     <h6>Seller: ${obj[idx].seller}</h6>
//                     <h6>Price: ${obj[idx].price}</h6>
//                 </div>
//                 </a>
//                 `;
//             div_list.appendChild(innerbox);
//         }
//     } // else if buy history list
// }
