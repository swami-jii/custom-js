(function () {

    function initCarousel() {

        const wrapper = document.querySelector(".carousel-wrapper");
        const nextBtn = document.querySelector(".carousel-btn.right");
        const prevBtn = document.querySelector(".carousel-btn.left");
        const seeAllBtn = document.getElementById("seeAllBtn");

        if (!wrapper) return false;

        let cardWidth =
            wrapper.querySelector(".carousel-card")?.offsetWidth + 16 || 250;

        function updateCardWidth() {
            cardWidth =
                wrapper.querySelector(".carousel-card")?.offsetWidth + 16 || 250;
        }

        /* ===============================
           BUTTON SCROLL
        =============================== */
        nextBtn?.addEventListener("click", () => {
            wrapper.scrollBy({ left: cardWidth, behavior: "smooth" });
        });

        prevBtn?.addEventListener("click", () => {
            wrapper.scrollBy({ left: -cardWidth, behavior: "smooth" });
        });

        /* ===============================
           AUTO SCROLL (DESKTOP)
        =============================== */
        let autoScroll;

        function isMobile() {
            return window.innerWidth <= 768;
        }

        function startAutoScroll() {
            if (isMobile()) return;

            autoScroll = setInterval(() => {
                wrapper.scrollBy({ left: cardWidth, behavior: "smooth" });

                if (
                    wrapper.scrollLeft + wrapper.clientWidth >=
                    wrapper.scrollWidth - cardWidth
                ) {
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

        window.addEventListener("resize", () => {
            stopAutoScroll();
            updateCardWidth();
            if (!isMobile()) startAutoScroll();
        });

        /* ===============================
           SHOW ALL / SHOW LESS
        =============================== */
        let expanded = false;

        seeAllBtn?.addEventListener("click", () => {
            expanded = !expanded;
            wrapper.classList.toggle("expanded", expanded);
            seeAllBtn.innerText = expanded ? "See Less" : "See All";
        });

        return true;
    }

    /* ===============================
       ELEMENTOR SAFE INIT
    =============================== */
    let attempts = 0;
    const waitForElementor = setInterval(() => {
        attempts++;
        if (initCarousel() || attempts > 20) {
            clearInterval(waitForElementor);
        }
    }, 300);

})();
