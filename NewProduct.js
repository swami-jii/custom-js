// Fixed Cart Popup with working emoji effects
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
        popup.innerHTML = `
            <h2>🎉 Woohoo! Cart Updated 😊</h2>
            <p>Your cart has been successfully updated! Happy shopping! 🛍️</p>
            <button class="close-popup">Close</button>
        `;

        popupWrapper.appendChild(popup);
        document.body.appendChild(popupWrapper);
        popup.style.display = "block";

        // Create effects after popup is in DOM
        setTimeout(function() {
            createPartyBlasterEffect(popup);
            createEmojiEffect(popup);
        }, 50);

        // Audio with better error handling
        try {
            var sound = new Audio();
            sound.src = "https://careersupport1.com/wp-content/uploads/2025/03/poper-party-2.mp3";
            sound.volume = 1.0;
            sound.load();
            sound.play().catch(function(e) {
                console.log("Audio play failed, trying fallback:", e);
                // Fallback without waiting for promise
                sound.play().catch(function() {});
            });
        } catch (e) {
            console.log("Audio initialization error:", e);
        }

        popup.querySelector(".close-popup").addEventListener("click", function () {
            popupWrapper.remove();
            document.body.classList.remove("popup-active");
            popupExists = false;
            cartUpdated = false;
        });
    }

    // Fixed Party Blaster Effect
    function createPartyBlasterEffect(popup) {
        if (!popup) return;
        
        var popupRect = popup.getBoundingClientRect();
        var centerX = popupRect.left + popupRect.width / 2;
        var centerY = popupRect.top + popupRect.height / 2;
        var poppers = [];

        for (var i = 0; i < 15; i++) {
            var popper = document.createElement("div");
            popper.classList.add("popper");
            popper.innerHTML = "🎉";
            popper.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                font-size: 30px;
                z-index: 9999;
                transition: transform 1.5s ease-out, opacity 1.5s;
                pointer-events: none;
            `;

            document.body.appendChild(popper);
            poppers.push(popper);

            var angle = (i / 15) * Math.PI * 2;
            var distance = Math.random() * 150 + 100;
            var endX = centerX + distance * Math.cos(angle);
            var endY = centerY + distance * Math.sin(angle);

            setTimeout(function(popper, endX, endY, centerX, centerY) {
                return function() {
                    popper.style.transform = `translate(${endX - centerX}px, ${endY - centerY}px) rotate(${Math.random() * 360}deg)`;
                    popper.style.opacity = "0";
                };
            }(popper, endX, endY, centerX, centerY), 50);

            setTimeout(function(popper) {
                return function() {
                    if (popper && popper.parentNode) {
                        popper.remove();
                    }
                };
            }(popper), 2000);
        }
    }

    // Fixed Emoji Effect
    function createEmojiEffect(popup) {
        if (!popup) return;
        
        var popupRect = popup.getBoundingClientRect();
        var emojis = ["😃", "😂", "😆", "😁", "😍", "🥳", "🤩"];
        var emojiElements = [];

        for (var i = 0; i < 20; i++) {
            var emoji = document.createElement("div");
            emoji.classList.add("emoji");
            emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.cssText = `
                position: fixed;
                left: ${popupRect.left + Math.random() * popupRect.width}px;
                top: ${popupRect.top + Math.random() * popupRect.height}px;
                font-size: 25px;
                z-index: 9999;
                transition: transform 1s ease-out, opacity 1s;
                pointer-events: none;
            `;

            document.body.appendChild(emoji);
            emojiElements.push(emoji);

            setTimeout(function(emoji) {
                return function() {
                    emoji.style.transform = `translateY(-${50 + Math.random() * 50}px) rotate(${Math.random() * 360}deg)`;
                    emoji.style.opacity = "0";
                };
            }(emoji), 50);

            setTimeout(function(emoji) {
                return function() {
                    if (emoji && emoji.parentNode) {
                        emoji.remove();
                    }
                };
            }(emoji), 1500);
        }
    }

    // Cart update listener
    document.addEventListener("click", function (e) {
        if (e.target.name === "update_cart" && e.target.name !== "apply_coupon") {
            cartUpdated = true;
            jQuery(document.body).on("updated_cart_totals", function () {
                showCartPopup();
                setTimeout(function() {
                    document.querySelectorAll(".woocommerce-message").forEach(function(el) {
                        el.style.display = "none";
                    });
                }, 300);
            });
        }
    });

    // Rest of your code remains unchanged...
    function manageCartHeadings() {
        var cartTotalsHeading = document.querySelector(".cart_totals h2");
        if (cartTotalsHeading) {
            var newHeading = document.createElement("h3");
            newHeading.innerHTML = cartTotalsHeading.innerHTML;
            newHeading.className = cartTotalsHeading.className;
            cartTotalsHeading.parentNode.replaceChild(newHeading, cartTotalsHeading);
        }

        var productTable = document.querySelector(".woocommerce-cart-form table.shop_table");
        if (productTable && !document.querySelector(".woocommerce-cart-form h3.your-cart-heading")) {
            var productHeading = document.createElement("h3");
            productHeading.innerText = "YOUR CART";
            productHeading.classList.add("your-cart-heading");
            productTable.parentNode.insertBefore(productHeading, productTable);
        }

        var couponContainer = document.querySelector(".woocommerce-cart-form .coupon");
        if (couponContainer && !document.querySelector(".woocommerce-cart-form h3.apply-coupon-heading")) {
            var couponHeading = document.createElement("h3");
            couponHeading.innerText = "APPLY COUPON";
            couponHeading.classList.add("apply-coupon-heading");
            couponHeading.style.marginBottom = "20px";
            couponContainer.insertBefore(couponHeading, couponContainer.firstChild);
        }

        if (isMobile) {
            document.querySelectorAll(".woocommerce-cart-form .product-remove").forEach(function (button) {
                var removeLink = button.querySelector("a");
                if (removeLink && !button.querySelector(".custom-cancel-btn")) {
                    var newButton = document.createElement("button");
                    newButton.innerText = "Cancel Product";
                    newButton.classList.add("custom-cancel-btn");
                    newButton.addEventListener("click", function () {
                        removeLink.click();
                    });
                    button.appendChild(newButton);
                }
            });
        }
    }

    manageCartHeadings();
    jQuery(document.body).on("updated_wc_div", function() {
        setTimeout(manageCartHeadings, 500);
    });

    var cartForm = document.querySelector(".woocommerce-cart-form");
    if (cartForm) {
        var cartObserver = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === "childList") {
                    manageCartHeadings();
                }
            }
        });
        cartObserver.observe(cartForm, { childList: true, subtree: true });
    }

    var accountPage = document.querySelector(".woocommerce");
    if (accountPage) {
        accountPage.querySelectorAll(".u-columns h2").forEach(function (heading) {
            var newHeading = document.createElement("h3");
            newHeading.innerHTML = heading.innerHTML;
            heading.replaceWith(newHeading);
        });

        accountPage.querySelectorAll(".woocommerce-Tabs-panel h2").forEach(function (heading) {
            var newHeading = document.createElement("h6");
            newHeading.innerHTML = heading.innerHTML;
            heading.replaceWith(newHeading);
        });
    }
});
