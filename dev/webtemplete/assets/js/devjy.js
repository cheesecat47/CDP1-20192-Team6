// product list in JSON format
var product_json = `{
    "1": {"img": "product-01.jpg","name": "연한 청바지","price": "Ξ1", "seller": "cheesecat47", "status": "배송중"},
    "2": {"img": "product-02.jpg","name": "짙은 청바지","price": "Ξ1.5", "seller": "cheesecat47", "status": "판매중"},
    "3": {"img": "product-03.jpg","name": "조끼 뒷모습","price": "Ξ2", "seller": "atg0831", "status": "판매중"},
    "4": {"img": "product-04.jpg","name": "하늘 나는 신발","price": "Ξ2.5", "seller": "cheesecat47", "status": "발송대기"},
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
    "wish": []
}`;

// main function
$(function () {
    // insert navbar
    fill_nav();

    // handle regist-item btn
    var btn_regist_item = $('#regist-item');
    btn_regist_item.click(function (event) {
        alert("상품 등록 버튼 클릭, 2-2-1 페이지로 이동");
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
                    <a class="nav-link" href="#">구매하기</a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link" href="2-2-selling.html">판매하기
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


function fill_selling_list(listname) {
    // read json data
    account = JSON.parse(my_account);
    obj = JSON.parse(product_json);

    // insert selling items list
    var div_list = document.getElementById(listname);

    // iterate to get each information in product list
    for (acc_idx in account['selling']) {
        idx = account.selling[acc_idx]
        
        var innerbox = document.createElement('div');
        innerbox.id = idx;
        innerbox.className = 'item new col-md-4';
        if (listname == 'selling-list') {
            innerbox.innerHTML = `
                <a href="single-product.html">
                <div class="featured-item">
                    <img src="assets/images/${obj[idx].img}" alt="No image">
                    <h4>${obj[idx].name}</h4>
                    <h6>${obj[idx].price}</h6>
                </div>
                </a>
                `;
        }
        else if (listname == 'request-list') {
            if (obj[idx].status == '배송중' || obj[idx].status == '발송대기') {
                innerbox.innerHTML = `
                    <a href="single-product.html">
                    <div class="featured-item">
                        <img src="assets/images/${obj[idx].img}" alt="No image">
                        <h4>${obj[idx].name}</h4>
                        <h6>${obj[idx].status}</h6>
                    </div>
                    </a>
                    `;
            }
        }
        div_list.appendChild(innerbox);
    }
}