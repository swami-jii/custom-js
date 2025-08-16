document.addEventListener("DOMContentLoaded", function () {
    // 🔁 1. Carousel Auto Slide + Button Scroll
    const wrapper = document.querySelector(".carousel-wrapper");
    const nextBtn = document.querySelector(".carousel-btn.right");
    const prevBtn = document.querySelector(".carousel-btn.left");
    const cards = document.querySelectorAll(".carousel-card");
    let cardWidth = cards[0]?.offsetWidth + 16 || 300;
    let autoScroll, autoScrollTimeout;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function updateCardWidth() {
        cardWidth = cards[0]?.offsetWidth + 16 || 300;
    }

    function startAutoScroll() {
    if (isMobile()) return; // Mobile par auto-slide off

    const wrapper = document.querySelector('.elementor-element.elementor-element-f5980e0.e-grid.e-con-full.carousel-wrapper'); // ✅ Sahi class
    if (!wrapper) return; // Agar wrapper nahi mila to scroll band

    const cardWidth = 250; // 🧠 Yahan aap apne card ka exact width daal sakte ho
    autoScroll = setInterval(() => {
        wrapper.scrollBy({ left: cardWidth, behavior: "smooth" });

        if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - cardWidth) {
            setTimeout(() => {
                wrapper.scrollTo({ left: 0, behavior: "auto" });
            }, 500);
        }
    }, 2000);
}

    function stopAutoScroll() {
        clearInterval(autoScroll);
        clearTimeout(autoScrollTimeout);
    }
    function restartAutoScroll() {
        if (isMobile()) return;
        stopAutoScroll();
        autoScrollTimeout = setTimeout(startAutoScroll, 3000);
    }
    nextBtn?.addEventListener("click", function () {
        stopAutoScroll();
        wrapper.scrollBy({ left: cardWidth, behavior: "smooth" });
        restartAutoScroll();
    });

    prevBtn?.addEventListener("click", function () {
        stopAutoScroll();
        wrapper.scrollBy({ left: -cardWidth, behavior: "smooth" });
        restartAutoScroll();
    });

    if (!isMobile()) startAutoScroll();

    wrapper?.addEventListener("mouseenter", stopAutoScroll);
    wrapper?.addEventListener("mouseleave", restartAutoScroll);
    window.addEventListener("resize", function () {
        updateCardWidth();
        stopAutoScroll();
        if (!isMobile()) startAutoScroll();
    });
    updateCardWidth();
    // 🧾 2. See All Button Toggle
    const seeAllBtn = document.getElementById("seeAllBtn");
    let isExpanded = false;

    seeAllBtn?.addEventListener("click", function () {
        isExpanded = !isExpanded;
        wrapper?.classList.toggle("expanded", isExpanded);
        seeAllBtn.innerText = isExpanded ? "See Less" : "See All";
    });
    // 🏷️ 3. Category Title Update on Card Click
    let shopTitle = document.querySelector(".elementor-divider__text");
    document.querySelectorAll(".carousel-card").forEach(card => {
        card.addEventListener("click", function () {
            let caption = card.querySelector(".elementor-image-box-description, .elementor-image-caption, figcaption");
            if (caption?.innerText.trim()) {
                shopTitle.textContent = caption.innerText.trim();
            }
        });
    });

    // 🔽 4. Custom Sorting Dropdown for WooCommerce
    function initCustomDropdown() {
        const checkExist = setInterval(() => {
            const originalSelect = document.querySelector(".woocommerce-ordering select");
            if (originalSelect) {
                clearInterval(checkExist);
                if (!document.querySelector(".custom-dropdown")) {
                    const dropdownContainer = document.createElement("div");
                    dropdownContainer.className = "custom-dropdown";

                    const selectedBox = document.createElement("div");
                    selectedBox.className = "selected";
                    selectedBox.textContent = originalSelect.options[originalSelect.selectedIndex].text;

                    const optionsBox = document.createElement("div");
                    optionsBox.className = "dropdown-options";

                    [...originalSelect.options].forEach((option, index) => {
                        const optionDiv = document.createElement("div");
                        optionDiv.textContent = option.text;
                        optionDiv.dataset.value = option.value;
                        if (index === originalSelect.selectedIndex) optionDiv.classList.add("active");

                        optionDiv.addEventListener("click", () => {
                            selectedBox.textContent = option.text;
                            originalSelect.value = option.value;
                            optionsBox.querySelectorAll("div").forEach(div => div.classList.remove("active"));
                            optionDiv.classList.add("active");
                            optionsBox.style.display = "none";
                            originalSelect.dispatchEvent(new Event("change"));
                        });

                        optionsBox.appendChild(optionDiv);
                    });

                    dropdownContainer.append(selectedBox, optionsBox);
                    originalSelect.parentNode.insertBefore(dropdownContainer, originalSelect);
                    dropdownContainer.style.visibility = "visible";
                    dropdownContainer.style.opacity = "1";

                    selectedBox.addEventListener("click", () => {
                        optionsBox.style.display = optionsBox.style.display === "block" ? "none" : "block";
                    });

                    document.addEventListener("click", event => {
                        if (!dropdownContainer.contains(event.target)) optionsBox.style.display = "none";
                    });
                }
            }
        }, 50);
    }

    initCustomDropdown();
    setTimeout(initCustomDropdown, 10);

    // 🛍️ 5. Show All Products Button
    let resultCount = document.querySelector(".woocommerce-result-count");
    let productContainer = document.querySelector(".products");
    let allProducts = productContainer ? Array.from(productContainer.children) : [];

    function addShowAllButton() {
        if (document.querySelector(".custom-show-all-btn") || !resultCount || !productContainer) return;

        let showAllBtn = document.createElement("button");
        showAllBtn.textContent = "Show All Products";
        showAllBtn.classList.add("custom-show-all-btn");
        resultCount.parentNode.insertBefore(showAllBtn, resultCount);

        showAllBtn.addEventListener("click", function () {
            productContainer.innerHTML = "";
            allProducts.forEach(product => productContainer.appendChild(product));
            resultCount.textContent = `Showing all ${allProducts.length} products`;
            if (shopTitle) shopTitle.textContent = "My Shop";
        });
    }

    new MutationObserver(() => addShowAllButton()).observe(document.body, { childList: true, subtree: true });

    // ⚡ 6. AJAX Filter on Category Card Click
    let cache = {};
    let xhr;
    let debounceTimeout;

    function updateProducts(htmlContent, category) {
    if (!productContainer) return; // Agar container hi nahi mila to kuch mat karo

    productContainer.innerHTML = htmlContent.trim() || '<div class="filter-no-products-message">No products available in this category.</div>';
    cache[category] = htmlContent;
    updateCategoryCount();
}

    function filterProducts(category = "") {
        if (cache[category]) return updateProducts(cache[category], category);
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            if (xhr) xhr.abort();
            xhr = new XMLHttpRequest();
            let url = `${window.location.origin}${window.location.pathname}${category ? "?product_cat=" + category : ""}`;
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let parser = new DOMParser();
                    let newDoc = parser.parseFromString(xhr.responseText, "text/html");
                    let newProducts = newDoc.querySelector(".products");
                    updateProducts(newProducts?.innerHTML || "", category);
                }
            };
            xhr.send();
        }, 100);
    }

    setTimeout(() => filterProducts(), 10);
    document.querySelectorAll(".carousel-card").forEach(card => {
        card.addEventListener("click", function () {
            document.querySelectorAll(".carousel-card").forEach(c => c.classList.remove("active"));
            this.classList.add("active");
            filterProducts(this.id);
        });
    });

    function updateCategoryCount() {
        let visibleProducts = document.querySelectorAll(".elementor-widget-wc-archive-products .product:not([style*='display: none'])");
        let totalCount = visibleProducts.length;
        let resultCountElement = document.querySelector(".woocommerce-result-count");
        if (resultCountElement) {
            resultCountElement.textContent = `Showing ${totalCount} results`;
        }
    }

    const productList = document.querySelector(".elementor-widget-wc-archive-products ul.products");
    if (productList) {
        new MutationObserver(() => updateCategoryCount()).observe(productList, { childList: true, subtree: true, attributes: true });
    }
});
