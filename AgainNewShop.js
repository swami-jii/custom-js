// AgainNewShop.js  ✅ SAFE VERSION

(function () {

    console.log("Carousel JS Loaded");

    function init() {

        const wrapper = document.querySelector(".carousel-wrapper");
        if (!wrapper) return;

        const nextBtn = document.querySelector(".carousel-btn.right");
        const prevBtn = document.querySelector(".carousel-btn.left");
        const seeAllBtn = document.getElementById("seeAllBtn");
        const cards = wrapper.querySelectorAll(".carousel-card");

        if (!cards.length) return;

        let cardWidth = cards[0].offsetWidth + 16;
        let autoScroll;
        let expanded = false;

        function isMobile() {
            return window.innerWidth <= 768;
        }

        function startAutoScroll() {
            if (isMobile()) return;
            autoScroll = setInterval(() => {
                wrapper.scrollBy({ left: cardWidth, behavior: "smooth" });
            }, 2000);
        }

        function stopAutoScroll() {
            clearInterval(autoScroll);
        }

        nextBtn?.addEventListener("click", () => {
            wrapper.scrollBy({ left: cardWidth, behavior: "smooth" });
        });

        prevBtn?.addEventListener("click", () => {
            wrapper.scrollBy({ left: -cardWidth, behavior: "smooth" });
        });

        seeAllBtn?.addEventListener("click", () => {
            expanded = !expanded;
            wrapper.classList.toggle("expanded", expanded);
            seeAllBtn.innerText = expanded ? "See Less" : "See All";
        });

        wrapper.addEventListener("mouseenter", stopAutoScroll);
        wrapper.addEventListener("mouseleave", startAutoScroll);

        startAutoScroll();
    }

    // Elementor safe wait
    let t = setInterval(() => {
        if (document.querySelector(".carousel-wrapper")) {
            clearInterval(t);
            init();
        }
    }, 300);

})();
