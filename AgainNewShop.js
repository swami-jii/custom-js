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
        autoScrollTimeout = setTimeout(startAutoScroll, 1000);
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
    
document.addEventListener("DOMContentLoaded", function () {

  const productWrap = document.querySelector(
    ".elementor-widget-wc-archive-products .products"
  );
  if (!productWrap) return;

  let xhr;
  let cache = {};

  function loadCategory(cat) {
    if (cache[cat]) {
      productWrap.innerHTML = cache[cat];
      return;
    }

    if (xhr) xhr.abort();
    xhr = new XMLHttpRequest();

    const url =
      window.location.pathname +
      (cat ? "?product_cat=" + cat : "");

    xhr.open("GET", url, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const doc = new DOMParser().parseFromString(
          xhr.responseText,
          "text/html"
        );
        const newProducts = doc.querySelector(".products");
        if (newProducts) {
          cache[cat] = newProducts.innerHTML;
          productWrap.innerHTML = newProducts.innerHTML;
        }
      }
    };
    xhr.send();
  }

  // 🔥 CARD CLICK → FILTER
  document.querySelectorAll(".carousel-card").forEach(card => {
    card.addEventListener("click", function () {

      document
        .querySelectorAll(".carousel-card")
        .forEach(c => c.classList.remove("active"));
      this.classList.add("active");

      const cat = this.dataset.cat || "";
      loadCategory(cat);
    });
  });

});
