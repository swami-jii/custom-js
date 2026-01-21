<script>
document.addEventListener("DOMContentLoaded", function () {

    /* ================================
       1. BASIC SELECTORS (ORIGINAL)
    ================================= */
    const wrapper = document.querySelector(".carousel-wrapper");
    const nextBtn = document.querySelector(".carousel-btn.right");
    const prevBtn = document.querySelector(".carousel-btn.left");
    const seeAllBtn = document.getElementById("seeAllBtn");

    if (!wrapper) return;

    /* ================================
       2. CARD WIDTH
    ================================= */
    let cardWidth = wrapper.querySelector(".carousel-card")?.offsetWidth + 16 || 250;

    function updateCardWidth() {
        cardWidth = wrapper.querySelector(".carousel-card")?.offsetWidth + 16 || 250;
    }

    /* ================================
       3. SMOOTH SCROLL BUTTONS
    ================================= */
    nextBtn?.addEventListener("click", function () {
        wrapper.scrollBy({ left: cardWidth, behavior: "smooth" });
    });

    prevBtn?.addEventListener("click", function () {
        wrapper.scrollBy({ left: -cardWidth, behavior: "smooth" });
    });

    /* ================================
       4. AUTO SCROLL (DESKTOP ONLY)
    ================================= */
    let autoScroll;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function startAutoScroll() {
        if (isMobile()) return;

        autoScroll = setInterval(() => {
            wrapper.scrollBy({ left: cardWidth, behavior: "smooth" });

            if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - cardWidth) {
                setTimeout(() => {
                    wrapper.scrollTo({ left: 0, behavior: "auto" });
                }, 400);
            }
        }, 2000);
    }

    function stopAutoScroll() {
        clearInterval(autoScroll);
    }

    if (!isMobile()) startAutoScroll();

    wrapper.addEventListener("mouseenter", stopAutoScroll);
    wrapper.addEventListener("mouseleave", startAutoScroll);

    window.addEventListener("resize", function () {
        stopAutoScroll();
        updateCardWidth();
        if (!isMobile()) startAutoScroll();
    });

    /* ================================
       5. SHOW ALL / SHOW LESS
    ================================= */
    let expanded = false;

    seeAllBtn?.addEventListener("click", function () {
        expanded = !expanded;
        wrapper.classList.toggle("expanded", expanded);
        seeAllBtn.innerText = expanded ? "See Less" : "See All";
    });

});
</script>
