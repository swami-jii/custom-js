document.addEventListener("DOMContentLoaded", function () {

    // 📌 1. Get main carousel wrapper
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

    // ⭐ FIXED AUTOPLAY FUNCTION (NO duplicate wrapper)
    function startAutoScroll() {
        if (isMobile()) return;
        if (!wrapper) return;

        autoScroll = setInterval(() => {
            wrapper.scrollBy({ left: cardWidth, behavior: "smooth" });

            // Loop back
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

    // ⭐ Buttons working on desktop
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

    // Start autoplay only on desktop
    if (!isMobile()) startAutoScroll();

    // Pause on hover
    wrapper?.addEventListener("mouseenter", stopAutoScroll);
    wrapper?.addEventListener("mouseleave", restartAutoScroll);

    // On resize update card width
    window.addEventListener("resize", () => {
        updateCardWidth();
        stopAutoScroll();
        if (!isMobile()) startAutoScroll();
    });

    updateCardWidth();


    // 🎯 2. See All Button
    const seeAllBtn = document.getElementById("seeAllBtn");
    let isExpanded = false;

    seeAllBtn?.addEventListener("click", () => {
        isExpanded = !isExpanded;
        wrapper?.classList.toggle("expanded", isExpanded);
        seeAllBtn.innerText = isExpanded ? "See Less" : "See All";
    });

    // 🎯 3. Update category title when card clicked
    let shopTitle = document.querySelector(".elementor-divider__text");
    document.querySelectorAll(".carousel-card").forEach(card => {
        card.addEventListener("click", () => {
            let caption = card.querySelector(".elementor-image-box-description, .elementor-image-caption, figcaption");
            if (caption?.innerText.trim()) {
                shopTitle.textContent = caption.innerText.trim();
            }
        });
    });
});

