$(function () {
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
                <li class="nav-item active">
                    <a class="nav-link" href="2-2-selling.html">판매하기
                        <span class="sr-only">(current)</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="about.html">About Us</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="contact.html">Contact Us</a>
                </li>
            </ul>
        </div>
    `;
    nav.appendChild(innerbox);


    // insert selling items list
    var item = document.getElementById('selling-list');
    // console.log(item);

    // read json data
    var jsondata = '{"1": {"img": "product-01.jpg","name": "연한 청바지","price": "$15.00"},"2": {"img": "product-02.jpg","name": "짙은 청바지","price": "$25.00"},"3": {"img": "product-03.jpg","name": "조끼 뒷모습","price": "$25.00"},"4": {"img": "product-04.jpg","name": "하늘 나는 신발","price": "$25.00"},"5": {"img": "product-05.jpg","name": "귀 두 개 가방","price": "$55.00"},"6": {"img": "product-06.jpg","name": "토끼 귀 가방","price": "$65.00"}}';
    obj = JSON.parse(jsondata);

    for (idx in obj){
        var innerbox = document.createElement('div');
        innerbox.id = idx;
        innerbox.className = 'item new col-md-4';
        innerbox.innerHTML = `
            <a href="single-product.html">
            <div class="featured-item">
                <img src="assets/images/${obj[idx].img}" alt="">
                <h4>${obj[idx].name}</h4>
                <h6>${obj[idx].price}</h6>
            </div>
            </a>
        `;
        // console.log(innerbox);
        item.appendChild(innerbox);
    }

    // handle regist-item btn
    var btn_regist_item = $('#regist-item');
    btn_regist_item.click(function(event){
        alert("상품 등록 버튼 클릭, 페이지 이동");
    });
});
