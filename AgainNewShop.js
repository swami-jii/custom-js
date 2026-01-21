<script>
document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       🔁 1. CAROUSEL AUTO SLIDE + BUTTON SCROLL
    ========================================= */
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
        if (isMobile()) return;
        if (!wrapper) return;

        const cardWidthLocal = 250;

        autoScroll = setInterval(() => {
            wrapper.scrollBy({ left: cardWidthLocal, behavior: "smooth" });

            if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - cardWidthLocal) {
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
        autoScrollTimeout = setTimeout(startAutoScroll, 1000);
    }

    nextBtn?.addEventListener("click", () => {
        stopAutoScroll();
        wrapper.scrollBy({ left: cardWidth, behavior: "smooth" });
        restartAutoScroll();
    });

    prevBtn?.addEventListener("click", () => {
        stopAutoScroll();
        wrapper.scrollBy({ left: -cardWidth, behavior: "smooth" });
        restartAutoScroll();
    });

    if (!isMobile()) startAutoScroll();
    wrapper?.addEventListener("mouseenter", stopAutoScroll);
    wrapper?.addEventListener("mouseleave", restartAutoScroll);

    window.addEventListener("resize", () => {
        updateCardWidth();
        stopAutoScroll();
        if (!isMobile()) startAutoScroll();
    });

    updateCardWidth();

    /* =========================================
       🧾 2. SEE ALL BUTTON (CAROUSEL)
    ========================================= */
    const seeAllBtn = document.getElementById("seeAllBtn");
    let isExpanded = false;

    seeAllBtn?.addEventListener("click", () => {
        isExpanded = !isExpanded;
        wrapper?.classList.toggle("expanded", isExpanded);
        seeAllBtn.innerText = isExpanded ? "See Less" : "See All";
    });

    /* =========================================
       🏷️ 3. DIVIDER TITLE
    ========================================= */
    let shopTitle = document.querySelector(".elementor-divider__text");

    /* =========================================
       🛒 LOOP WIDGET SAFE HELPERS
    ========================================= */
    function getProductContainer() {
        return document.querySelector(".custom-loop-products .products") ||
               document.querySelector(".custom-loop-products");
    }

    function getAllProducts() {
        const container = getProductContainer();
        return container ? Array.from(container.children) : [];
    }

    /* =========================================
       🔽 4. CUSTOM SORT DROPDOWN
    ========================================= */
    function initCustomDropdown() {
        const checkExist = setInterval(() => {
            const originalSelect = document.querySelector(".woocommerce-ordering select");
            if (!originalSelect) return;

            clearInterval(checkExist);
            if (document.querySelector(".custom-dropdown")) return;

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

            selectedBox.addEventListener("click", () => {
                optionsBox.style.display = optionsBox.style.display === "block" ? "none" : "block";
            });

            document.addEventListener("click", e => {
                if (!dropdownContainer.contains(e.target)) optionsBox.style.display = "none";
            });
        }, 50);
    }

    initCustomDropdown();
    setTimeout(initCustomDropdown, 10);

    /* =========================================
       🛍️ 5. SHOW ALL PRODUCTS BUTTON
    ========================================= */
    let resultCount = document.querySelector(".woocommerce-result-count");

    function addShowAllButton() {
        if (document.querySelector(".custom-show-all-btn")) return;
        if (!resultCount || !getProductContainer()) return;

        let btn = document.createElement("button");
        btn.textContent = "Show All Products";
        btn.className = "custom-show-all-btn";

        resultCount.parentNode.insertBefore(btn, resultCount);

        btn.addEventListener("click", () => {
            const container = getProductContainer();
            const products = getAllProducts();
            if (!container) return;

            container.innerHTML = "";
            products.forEach(p => container.appendChild(p));

            if (resultCount) resultCount.textContent = `Showing all ${products.length} products`;
            if (shopTitle) shopTitle.textContent = "My Shop";
        });
    }

    new MutationObserver(addShowAllButton)
        .observe(document.body, { childList: true, subtree: true });

    /* =========================================
       ⚡ 6. AJAX CATEGORY FILTER
    ========================================= */
    let cache = {};
    let xhr;
    let debounceTimeout;

    function updateProducts(html, category) {
        const container = getProductContainer();
        if (!container) return;

        container.innerHTML = html.trim() ||
            '<div class="filter-no-products-message">No products available in this category.</div>';

        cache[category] = html;
        updateCategoryCount();
    }

    function filterProducts(category = "") {
        if (cache[category]) return updateProducts(cache[category], category);

        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            if (xhr) xhr.abort();

            xhr = new XMLHttpRequest();
            let url = `${location.origin}${location.pathname}${category ? "?product_cat=" + category : ""}`;

            xhr.open("GET", url, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let doc = new DOMParser().parseFromString(xhr.responseText, "text/html");
                    let newProducts = doc.querySelector(".products");
                    updateProducts(newProducts?.innerHTML || "", category);
                }
            };
            xhr.send();
        }, 100);
    }

    setTimeout(() => filterProducts(), 10);

    /* =========================================
       🎯 CAROUSEL CARD CLICK (EVENT DELEGATION)
    ========================================= */
    document.addEventListener("click", function (e) {
        const card = e.target.closest(".carousel-card");
        if (!card) return;

        document.querySelectorAll(".carousel-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        filterProducts(card.id);

        let caption = card.querySelector(".elementor-image-box-description, figcaption");
        if (caption && shopTitle) shopTitle.textContent = caption.innerText.trim();
    });

    /* =========================================
       📊 RESULT COUNT UPDATE
    ========================================= */
    function updateCategoryCount() {
        const visible = document.querySelectorAll(
            ".elementor-widget-wc-archive-products .product:not([style*='display: none'])"
        );
        if (resultCount) resultCount.textContent = `Showing ${visible.length} results`;
    }

});
</script>
