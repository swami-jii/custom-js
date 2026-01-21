<script>
document.addEventListener("DOMContentLoaded", function () {

/* =====================================================
   🔁 1. CAROUSEL (UNCHANGED)
===================================================== */
const wrapper = document.querySelector(".carousel-wrapper");
const nextBtn = document.querySelector(".carousel-btn.right");
const prevBtn = document.querySelector(".carousel-btn.left");
const cards = document.querySelectorAll(".carousel-card");

let cardWidth = cards[0]?.offsetWidth + 16 || 300;
let autoScroll, autoScrollTimeout;

const isMobile = () => window.innerWidth <= 768;

function updateCardWidth() {
    cardWidth = cards[0]?.offsetWidth + 16 || 300;
}

function startAutoScroll() {
    if (isMobile()) return;

    const wrapperEl = document.querySelector('.carousel-wrapper');
    if (!wrapperEl) return;

    const w = 250;
    autoScroll = setInterval(() => {
        wrapperEl.scrollBy({ left: w, behavior: "smooth" });
        if (wrapperEl.scrollLeft + wrapperEl.clientWidth >= wrapperEl.scrollWidth - w) {
            setTimeout(() => wrapperEl.scrollTo({ left: 0, behavior: "auto" }), 500);
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

wrapper?.addEventListener("mouseenter", stopAutoScroll);
wrapper?.addEventListener("mouseleave", restartAutoScroll);

if (!isMobile()) startAutoScroll();
window.addEventListener("resize", () => {
    updateCardWidth();
    stopAutoScroll();
    if (!isMobile()) startAutoScroll();
});

/* =====================================================
   🧾 2. SHOW ALL / LESS (UNCHANGED)
===================================================== */
const seeAllBtn = document.getElementById("seeAllBtn");
let expanded = false;

seeAllBtn?.addEventListener("click", () => {
    expanded = !expanded;
    wrapper?.classList.toggle("expanded", expanded);
    seeAllBtn.innerText = expanded ? "See Less" : "See All";
});

/* =====================================================
   🏷️ 3. DIVIDER TITLE (UNCHANGED)
===================================================== */
const shopTitle = document.querySelector(".elementor-divider__text");

/* =====================================================
   🛒 🔧 PATCH 1: SAFE PRODUCT CONTAINER
===================================================== */
function getProductContainer() {
    return document.querySelector(".custom-loop-products .products")
        || document.querySelector(".products");
}

/* =====================================================
   🛍️ 5. SHOW ALL PRODUCTS (PATCHED)
===================================================== */
let resultCount = document.querySelector(".woocommerce-result-count");
let allProducts = [];

function refreshAllProducts() {
    const container = getProductContainer();
    if (container) allProducts = Array.from(container.children);
}

refreshAllProducts();

function addShowAllButton() {
    if (document.querySelector(".custom-show-all-btn")) return;
    if (!resultCount) return;

    const btn = document.createElement("button");
    btn.textContent = "Show All Products";
    btn.className = "custom-show-all-btn";
    resultCount.parentNode.insertBefore(btn, resultCount);

    btn.addEventListener("click", () => {
        const container = getProductContainer();
        if (!container) return;

        refreshAllProducts();
        container.innerHTML = "";
        allProducts.forEach(p => container.appendChild(p));

        resultCount.textContent = `Showing all ${allProducts.length} products`;
        if (shopTitle) shopTitle.textContent = "My Shop";
    });
}

new MutationObserver(addShowAllButton)
.observe(document.body, { childList: true, subtree: true });

/* =====================================================
   ⚡ 6. AJAX FILTER (ORIGINAL + SAFE)
===================================================== */
let cache = {};
let xhr, debounce;

function updateProducts(html, cat) {
    const container = getProductContainer();
    if (!container) return;

    container.innerHTML = html || '<div>No products available</div>';
    cache[cat] = html;
    refreshAllProducts();
}

function filterProducts(category = "") {
    if (cache[category]) return updateProducts(cache[category], category);

    clearTimeout(debounce);
    debounce = setTimeout(() => {
        if (xhr) xhr.abort();
        xhr = new XMLHttpRequest();

        const url = `${location.origin}${location.pathname}${category ? "?product_cat=" + category : ""}`;
        xhr.open("GET", url, true);

        xhr.onload = () => {
            const doc = new DOMParser().parseFromString(xhr.responseText, "text/html");
            const products = doc.querySelector(".products");
            updateProducts(products?.innerHTML || "", category);
        };
        xhr.send();
    }, 100);
}

setTimeout(() => filterProducts(), 10);

/* =====================================================
   🎯 🔧 PATCH 2: CARD CLICK (EVENT DELEGATION)
===================================================== */
document.addEventListener("click", function (e) {
    const card = e.target.closest(".carousel-card");
    if (!card) return;

    document.querySelectorAll(".carousel-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    filterProducts(card.id);

    const caption = card.querySelector(".elementor-image-box-description, figcaption, .elementor-image-caption");
    if (caption && shopTitle) shopTitle.textContent = caption.innerText.trim();
});

});
</script>
