/* ---------- Performance-safe Mobile Detection ---------- */
var isMobile = window.innerWidth <= 768;

/* ---------- Fixed Cart Popup with working emoji effects ---------- */
var popupExists = false;
var cartUpdated = false;
var cartEventBound = false;

function showCartPopup() {
    if (popupExists || !cartUpdated) return;
    popupExists = true;

    document.body.classList.add("popup-active");

    var popupWrapper = document.createElement("div");
    popupWrapper.className = "popup-wrapper";

    var popup = document.createElement("div");
    popup.className = "cart-popup";
    popup.innerHTML = `
        <h2>🎉 Woohoo! Cart Updated 😊</h2>
        <p>Your cart has been successfully updated! Happy shopping! 🛍️</p>
        <button class="close-popup">Close</button>
    `;

    popupWrapper.appendChild(popup);
    document.body.appendChild(popupWrapper);

    setTimeout(function () {
        createPartyBlasterEffect(popup);
        createEmojiEffect(popup);
    }, 50);

    /* ---------- Audio (safe & non-blocking) ---------- */
    try {
        var sound = new Audio("https://careersupport1.com/wp-content/uploads/2025/03/poper-party-2.mp3");
        sound.volume = 1;
        sound.play().catch(function () {});
    } catch (e) {}

    popup.querySelector(".close-popup").addEventListener("click", function () {
        popupWrapper.remove();
        document.body.classList.remove("popup-active");
        popupExists = false;
        cartUpdated = false;
    });
}

/* ---------- Party Blaster Effect (optimized) ---------- */
function createPartyBlasterEffect(popup) {
    if (!popup) return;

    var rect = popup.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;

    for (var i = 0; i < 15; i++) {
        var popper = document.createElement("div");
        popper.textContent = "🎉";
        popper.style.cssText =
            "position:fixed;left:" + cx + "px;top:" + cy + "px;font-size:30px;z-index:9999;" +
            "transition:transform 1.5s ease-out,opacity 1.5s;pointer-events:none";

        document.body.appendChild(popper);

        var angle = (i / 15) * Math.PI * 2;
        var dist = Math.random() * 150 + 100;
        var x = dist * Math.cos(angle);
        var y = dist * Math.sin(angle);

        setTimeout(function (el, x, y) {
            el.style.transform = "translate(" + x + "px," + y + "px) rotate(" + Math.random() * 360 + "deg)";
            el.style.opacity = "0";
        }.bind(null, popper, x, y), 30);

        setTimeout(function (el) {
            el.remove();
        }.bind(null, popper), 1800);
    }
}

/* ---------- Emoji Effect (optimized) ---------- */
function createEmojiEffect(popup) {
    if (!popup) return;

    var rect = popup.getBoundingClientRect();
    var emojis = ["😃", "😂", "😆", "😁", "😍", "🥳", "🤩"];

    for (var i = 0; i < 20; i++) {
        var emoji = document.createElement("div");
        emoji.textContent = emojis[(Math.random() * emojis.length) | 0];
        emoji.style.cssText =
            "position:fixed;left:" + (rect.left + Math.random() * rect.width) +
            "px;top:" + (rect.top + Math.random() * rect.height) +
            "px;font-size:25px;z-index:9999;transition:transform 1s ease-out,opacity 1s;pointer-events:none";

        document.body.appendChild(emoji);

        setTimeout(function (el) {
            el.style.transform = "translateY(-" + (50 + Math.random() * 50) + "px) rotate(" + Math.random() * 360 + "deg)";
            el.style.opacity = "0";
        }.bind(null, emoji), 30);

        setTimeout(function (el) {
            el.remove();
        }.bind(null, emoji), 1200);
    }
}

/* ---------- Cart Update Listener (single bind) ---------- */
document.addEventListener("click", function (e) {
    if (e.target && e.target.name === "update_cart") {
        cartUpdated = true;

        if (!cartEventBound && window.jQuery) {
            cartEventBound = true;
            jQuery(document.body).on("updated_cart_totals", function () {
                showCartPopup();
                setTimeout(function () {
                    document.querySelectorAll(".woocommerce-message").forEach(function (el) {
                        el.style.display = "none";
                    });
                }, 300);
            });
        }
    }
});

/* ---------- Cart Headings Manager (unchanged logic, optimized DOM) ---------- */
function manageCartHeadings() {
    var cartTotalsHeading = document.querySelector(".cart_totals h2");
    if (cartTotalsHeading) {
        var h3 = document.createElement("h3");
        h3.innerHTML = cartTotalsHeading.innerHTML;
        h3.className = cartTotalsHeading.className;
        cartTotalsHeading.replaceWith(h3);
    }

    var table = document.querySelector(".woocommerce-cart-form table.shop_table");
    if (table && !document.querySelector(".your-cart-heading")) {
        var ph = document.createElement("h3");
        ph.textContent = "YOUR CART";
        ph.className = "your-cart-heading";
        table.parentNode.insertBefore(ph, table);
    }

    var coupon = document.querySelector(".woocommerce-cart-form .coupon");
    if (coupon && !document.querySelector(".apply-coupon-heading")) {
        var ch = document.createElement("h3");
        ch.textContent = "APPLY COUPON";
        ch.className = "apply-coupon-heading";
        ch.style.marginBottom = "20px";
        coupon.insertBefore(ch, coupon.firstChild);
    }

    if (isMobile) {
        document.querySelectorAll(".product-remove").forEach(function (btn) {
            var link = btn.querySelector("a");
            if (link && !btn.querySelector(".custom-cancel-btn")) {
                var b = document.createElement("button");
                b.textContent = "Cancel Product";
                b.className = "custom-cancel-btn";
                b.onclick = function () {
                    link.click();
                };
                btn.appendChild(b);
            }
        });
    }
}

manageCartHeadings();
