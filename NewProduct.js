// First fix the Dokan plugin errors by preventing them from breaking your code
(function() {
    var originalErrorHandler = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        if (source && source.includes('/dokan-pro/')) {
            console.log('Dokan resource loading suppressed:', source);
            return true; // Prevent error from propagating
        }
        if (originalErrorHandler) {
            return originalErrorHandler(message, source, lineno, colno, error);
        }
    };
})();
	
	// Add this at the very top of your script
window.addEventListener('error', function(e) {
  if (e.target && 
     (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') && 
     e.target.src.includes('/dokan-pro/')) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Dokan resource loading suppressed:', e.target.src);
    return true;
  }
}, true);

jQuery(document).ready(function ($) {
    function updateStarRatings() {
        $(".woocommerce ul.products li.product, .elementor-widget-woocommerce-products ul.products li.product").each(function () {
            var $product = $(this);
            var productId = $product.find("a.add_to_cart_button").attr("data-product_id");
            var ratingContainer = $product.find(".star-rating");
            var priceContainer = $product.find(".price");
    
            if (!productId || $product.find(".custom-star-price").length > 0) return;
    
            $.ajax({
                url: "/wp-json/wc/v3/products/" + productId,
                method: "GET",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(wcApiKeys.consumer_key + ":" + wcApiKeys.consumer_secret));
                },
                success: function (data) {
                    var ratingValue = (data && data.average_rating) ? parseFloat(data.average_rating).toFixed(1) : "0.0";
                    var ratingCount = (data && data.rating_count) ? data.rating_count : "0";
                    var priceHTML = priceContainer.prop('outerHTML');
    
                    var customHtml = `
                        <div class="custom-star-price">
                            <div class="custom-star-rating">
                                <span class="star">★</span> 
                                <strong>${ratingValue}</strong> (${ratingCount})
                            </div>
                            <div class="price-container">${priceHTML}</div>
                        </div>`
                    ;
    
                    if (ratingContainer.length > 0) ratingContainer.remove();
                    priceContainer.replaceWith(customHtml);
                },
                error: function (error) {
                    console.log("Error fetching rating data:", error);
                }
            });
        });
    }
    
    updateStarRatings();
    
    var productsContainer = document.querySelector(".woocommerce ul.products, .elementor-widget-woocommerce-products ul.products");
    if (productsContainer) {
        var observer = new MutationObserver(function () {
            updateStarRatings();
        });
        observer.observe(productsContainer, { childList: true, subtree: true });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var isMobile = window.innerWidth <= 768;
    
    // Mobile TOC code remains unchanged
    if (isMobile) {
        var tocWidget = document.querySelector(".elementor-widget-table-of-contents");
        if (tocWidget) {
            var tocHeader = tocWidget.querySelector(".elementor-toc__header");
            var tocBody = tocWidget.querySelector(".elementor-toc__body");
            var privacyHeading = document.querySelector("h1");

            if (tocHeader && tocBody) {
                tocBody.style.display = "none";
                var toggleButton = document.createElement("button");
                toggleButton.className = "custom-toc-toggle";
                toggleButton.innerHTML = "▼";
                tocHeader.appendChild(toggleButton);

                tocHeader.addEventListener("click", function() {
                    if (tocBody.style.display === "none") {
                        tocBody.style.display = "block";
                        toggleButton.innerHTML = "▲";
                    } else {
                        tocBody.style.display = "none";
                        toggleButton.innerHTML = "▼";
                    }
                });
            }

            if (tocWidget && privacyHeading) {
                privacyHeading.parentNode.insertBefore(tocWidget, privacyHeading);
            }
        }
    }

    // H2 to H1 conversion remains unchanged
    function convertH2toH1() {
        document.querySelectorAll(".woocommerce-loop-product__title").forEach(function (el) {
            if (el.tagName === "H2") {
                var newEl = document.createElement("h1");
                newEl.innerHTML = el.innerHTML;
                newEl.className = el.className;
                el.parentNode.replaceChild(newEl, el);
            }
            el.style.visibility = "visible";
        });
    }

    convertH2toH1();
    
    var bodyElement = document.body;
    if (bodyElement) {
        var titleObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        convertH2toH1();
                    }
                });
            });
        });
        titleObserver.observe(bodyElement, { childList: true, subtree: true });
    }

    // Mobile menu code remains unchanged
    var menuIcon = document.querySelector("#mobile-menu-icon");
    var menuToggle = document.querySelector("#toggle-mobile-menu");
    if (menuIcon && menuToggle) {
        var menuButton = document.createElement("button");
        menuButton.innerText = "Click for Menu";
        menuButton.classList.add("custom-menu-btn");
        menuIcon.style.display = "none";
        menuIcon.parentNode.replaceChild(menuButton, menuIcon);

        menuButton.addEventListener("click", function () {
            menuToggle.checked = !menuToggle.checked;
        });
    }

    // Account menu code remains unchanged
    var menu = document.querySelector(".woocommerce-MyAccount-navigation");
    if (menu) {
        var toggleButton = document.createElement("div");
        toggleButton.classList.add("toggle-menu");
        toggleButton.innerText = "Click For Dropdown";
        menu.parentNode.insertBefore(toggleButton, menu);

        toggleButton.addEventListener("click", function () {
            menu.style.display = menu.style.display === "grid" ? "none" : "grid";
        });
    }

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
