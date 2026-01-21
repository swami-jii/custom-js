<script>
document.addEventListener("DOMContentLoaded", function () {

/* =====================================================
   🔁 1. CAROUSEL GRID (AUTO + LEFT RIGHT)
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
    if (isMobile() || !wrapper) return;

    autoScroll = setInterval(() => {
        wrapper.scrollBy({ left: 250, behavior: "smooth" });

        if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 250) {
            setTimeout(() => wrapper.scrollTo({ left: 0, behavior: "auto" }), 500);
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
   🧾 2. SHOW ALL / SHOW LESS (GRID EXPAND)
===================================================== */
const seeAllBtn = document.getElementById("seeAllBtn");
let expanded = false;

seeAllBtn?.addEventListener("click", () => {
    expanded = !expanded;
    wrapper?.classList.toggle("expanded", expanded);
    seeAllBtn.innerText = expanded ? "See Less" : "See All";
});

/* =====================================================
   🏷️ 3. DIVIDER TITLE
===================================================== */
const shopTitle = document.querySelector(".elementor-divider__text");

/* =====================================================
   🛒 LOOP WIDGET SAFE PRODUCT SELECTOR
===================================================== */
function getProductContainer() {
    return document.querySelector(".custom-loop-products .products")
        || document.querySelector(".custom-loop-products");
}

/* =====================================================
   ⚡ 4. AJAX CATEGORY FILTER (ORIGINAL LOGIC)
===================================================== */
let cache = {};
let xhr, debounce;

function updateProducts(html, cat) {
    const container = getProductContainer();
    if (!container) return;

    container.innerHTML = html || '<div>No products found</div>';
    cache[cat] = html;
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
   🎯 5. CARD CLICK (CATEGORY + TITLE + FILTER)
===================================================== */
document.addEventListener("click", function (e) {
    const card = e.target.closest(".carousel-card");
    if (!card) return;

    document.querySelectorAll(".carousel-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    // FILTER
    filterProducts(card.id);

    // TITLE CHANGE
    const caption = card.querySelector(
        ".elementor-image-box-description, figcaption, .elementor-image-caption"
    );
    if (caption && shopTitle) {
        shopTitle.textContent = caption.innerText.trim();
    }
});

});
</script>
