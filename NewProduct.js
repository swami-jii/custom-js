/* Safe mobile check */
var isMobile = false;
try {
    isMobile = window.matchMedia("(max-width: 768px)").matches;
} catch (e) {
    isMobile = window.innerWidth <= 768;
}

/* Cart Popup */
var popupExists = false;
var cartUpdated = false;

function showCartPopup() {
    if (popupExists || !cartUpdated) return;
    popupExists = true;

    document.body.classList.add("popup-active");

    var popupWrapper = document.createElement("div");
    popupWrapper.classList.add("popup-wrapper");

    var popup = document.createElement("div");
    popup.classList.add("cart-popup");
    popup.innerHTML =
        '<h2>🎉 Woohoo! Cart Updated 😊</h2>' +
        '<p>Your cart has been successfully updated! Happy shopping! 🛍️</p>' +
        '<button class="close-popup">Close</button>';

    popupWrapper.appendChild(popup);
    document.body.appendChild(popupWrapper);
    popup.style.display = "block";

    setTimeout(function () {
        createPartyBlasterEffect(popup);
        createEmojiEffect(popup);
    }, 50);

    try {
        var sound = new Audio("https://careersupport1.com/wp-content/uploads/2025/03/poper-party-2.mp3");
        sound.volume = 1.0;
        sound.load();
        sound.play().catch(function() {});
    } catch (e) {}

    var closeBtn = popup.querySelector(".close-popup");
    if(closeBtn){
        closeBtn.addEventListener("click", function () {
            popupWrapper.remove();
            document.body.classList.remove("popup-active");
            popupExists = false;
            cartUpdated = false;
        });
    }
}

/* Party Blaster */
function createPartyBlasterEffect(popup) {
    if (!popup) return;

    var rect = popup.getBoundingClientRect();
    var cx = rect.left + rect.width/2;
    var cy = rect.top + rect.height/2;

    for(var i=0;i<15;i++){
        var popper = document.createElement("div");
        popper.classList.add("popper");
        popper.innerHTML = "🎉";
        popper.style.cssText = "position:fixed;left:"+cx+"px;top:"+cy+"px;font-size:30px;z-index:9999;transition:transform 1.5s ease-out,opacity 1.5s;pointer-events:none;";
        document.body.appendChild(popper);

        var angle = (i/15)*Math.PI*2;
        var distance = Math.random()*150 + 100;
        var ex = cx + distance*Math.cos(angle);
        var ey = cy + distance*Math.sin(angle);

        (function(el,endX,endY){
            setTimeout(function(){
                el.style.transform = "translate("+(endX-cx)+"px,"+(endY-cy)+"px) rotate("+Math.random()*360+"deg)";
                el.style.opacity = "0";
            },50);
            setTimeout(function(){ el.remove(); },2000);
        })(popper,ex,ey);
    }
}

/* Emoji effect */
function createEmojiEffect(popup){
    if(!popup) return;

    var rect = popup.getBoundingClientRect();
    var emojis = ["😃","😂","😆","😁","😍","🥳","🤩"];

    for(var i=0;i<20;i++){
        var emoji = document.createElement("div");
        emoji.classList.add("emoji");
        emoji.innerHTML = emojis[Math.floor(Math.random()*emojis.length)];
        emoji.style.cssText = "position:fixed;left:"+(rect.left+Math.random()*rect.width)+"px;top:"+(rect.top+Math.random()*rect.height)+"px;font-size:25px;z-index:9999;transition:transform 1s ease-out,opacity 1s;pointer-events:none;";
        document.body.appendChild(emoji);

        (function(el){
            setTimeout(function(){
                el.style.transform = "translateY(-"+(50+Math.random()*50)+"px) rotate("+Math.random()*360+"deg)";
                el.style.opacity="0";
            },50);
            setTimeout(function(){ el.remove(); },1500);
        })(emoji);
    }
}

/* Cart update listener */
document.addEventListener("click",function(e){
    if(e.target && e.target.name==="update_cart"){
        cartUpdated = true;
        if(window.jQuery){
            jQuery(document.body).on("updated_cart_totals",function(){
                showCartPopup();
                setTimeout(function(){
                    document.querySelectorAll(".woocommerce-message").forEach(function(el){ el.style.display="none"; });
                },300);
            });
        }
    }
});

/* Cart headings */
function manageCartHeadings(){
    var cartTotalsHeading = document.querySelector(".cart_totals h2");
    if(cartTotalsHeading){
        var newH = document.createElement("h3");
        newH.innerHTML = cartTotalsHeading.innerHTML;
        newH.className = cartTotalsHeading.className;
        cartTotalsHeading.parentNode.replaceChild(newH,cartTotalsHeading);
    }

    var productTable = document.querySelector(".woocommerce-cart-form table.shop_table");
    if(productTable && !document.querySelector(".your-cart-heading")){
        var h = document.createElement("h3");
        h.innerText = "YOUR CART";
        h.classList.add("your-cart-heading");
        productTable.parentNode.insertBefore(h,productTable);
    }

    var couponContainer = document.querySelector(".woocommerce-cart-form .coupon");
    if(couponContainer && !document.querySelector(".apply-coupon-heading")){
        var h = document.createElement("h3");
        h.innerText = "APPLY COUPON";
        h.classList.add("apply-coupon-heading");
        h.style.marginBottom = "20px";
        couponContainer.insertBefore(h,couponContainer.firstChild);
    }

    if(isMobile){
        document.querySelectorAll(".woocommerce-cart-form .product-remove").forEach(function(button){
            var link = button.querySelector("a");
            if(link && !button.querySelector(".custom-cancel-btn")){
                var btn = document.createElement("button");
                btn.innerText = "Cancel Product";
                btn.classList.add("custom-cancel-btn");
                btn.addEventListener("click",function(){ link.click(); });
                button.appendChild(btn);
            }
        });
    }
}

manageCartHeadings();
