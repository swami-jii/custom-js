/* =====================================================
   GLOBAL SAFETY FIX (DO NOT REMOVE)
   ===================================================== */
(function () {
    if (typeof window.isMobile === "undefined") {
        window.isMobile =
            window.matchMedia &&
            window.matchMedia("(max-width: 768px)").matches;
    }
})();

/* =====================================================
   Fixed Cart Popup with working emoji effects
   ===================================================== */
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

/* ---------- Party Blaster ---------- */
function createPartyBlasterEffect(popup) {
    if (!popup) return;

    var r = popup.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;

    for (var i = 0; i < 15; i++) {
        var el = document.createElement("div");
        el.textContent = "🎉";
        el.style.cssText =
            "position:fixed;left:" + cx + "px;top:" + cy +
            "px;font-size:30px;z-index:9999;pointer-events:none;" +
            "transition:transform 1.5s ease-out,opacity 1.5s";

        document.body.appendChild(el);

        var a = (i / 15) * Math.PI * 2;
        var d = Math.random() * 150 + 100;

        setTimeout(function (e, x, y) {
            e.style.transform =
                "translate(" + x + "px," + y + "px) rotate(360deg)";
            e.style.opacity = "0";
        }.bind(null, el, Math.cos(a) * d, Math.sin(a) * d), 30);

        setTimeout(function (e) {
            e.remove();
        }.bind(null, el), 1800);
    }
}

/* ---------- Emoji Effect ---------- */
function createEmojiEffect(popup) {
    if (!popup) return;

    var r = popup.getBoundingClientRect();
    var emojis = ["😃", "😂", "😆", "😁", "😍", "🥳", "🤩"];

    for (var i = 0; i < 20; i++) {
        var e = document.createElement("div");
        e.textContent = emojis[(Math.random() * emojis.length) | 0];
        e.style.cssText =
            "position:fixed;left:" + (r.left + Math.random() * r.width) +
            "px;top:" + (r.top + Math.random() * r.height) +
            "px;font-size:25px;z-index:9999;pointer-events:none;" +
            "transition:transform 1s ease-out,opacity 1s";

        document.body.appendChild(e);

        setTimeout(function (el) {
            el.style.transform = "translateY(-80px) rotate(360deg)";
            el.style.opacity = "0";
        }.bind(null, e), 30);

        setTimeout(function (el) {
            el.remove();
        }.bind(null, e), 1200);
    }
}

/* ---------- Cart Listener ---------- */
document.addEventListener("click", function (e) {
    if (e.target && e.target.name === "update_cart") {
        cartUpdated = true;

        if (!cartEventBound && window.jQuery) {
            cartEventBound = true;
            jQuery(document.body).on("updated_cart_totals", function () {
                showCartPopup();
            });
        }
    }
});

/* ---------- Cart Headings ---------- */
function manageCartHeadings() {
    if (window.isMobile) {
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
