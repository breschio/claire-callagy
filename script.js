class Carousel {
    constructor(container) {
        this.container = container;
        this.items = container.querySelectorAll('.carousel-item');
        this.totalItems = this.items.length;
        this.currentIndex = 0;
        this.interval = null;
        this.isLifestyle = this.container.classList.contains('carousel-lifestyle');
        
        this.init();
    }

    init() {
        // Clone first set of items and append them
        for (let i = 0; i < this.totalItems; i++) {
            const clone = this.items[i].cloneNode(true);
            this.container.appendChild(clone);
        }

        // Set initial opacity
        this.updateOpacity();
        
        // Position first item without transition
        this.container.style.transition = 'none';
        this.moveToIndex(0);
        
        // Force a reflow before enabling transitions
        this.container.offsetHeight;
        
        // Start auto-scroll after a brief delay
        setTimeout(() => {
            this.startAutoScroll();
        }, 100);
    }

    moveToIndex(index) {
        const itemWidth = this.isLifestyle ? 450 : this.items[0].querySelector('img').offsetWidth;
        const translateX = -(index * (itemWidth + 16));
        this.container.style.transform = `translateX(${translateX}px)`;
    }

    updateOpacity() {
        const normalizedIndex = this.currentIndex % this.totalItems;
        this.container.querySelectorAll('.carousel-item').forEach((item, i) => {
            const itemIndex = i % this.totalItems;
            item.style.opacity = itemIndex === normalizedIndex ? '1' : '0.3';
        });
    }

    next() {
        this.currentIndex++;
        this.container.style.transition = 'transform 0.5s ease-in-out';
        this.moveToIndex(this.currentIndex);
        this.updateOpacity();

        // Reset position when we reach the cloned set
        if (this.currentIndex >= this.totalItems) {
            setTimeout(() => {
                this.container.style.transition = 'none';
                this.currentIndex = 0;
                this.moveToIndex(0);
            }, 500);
        }
    }

    startAutoScroll() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => this.next(), 3000);
    }
}

class TabManager {
    constructor() {
        this.tabs = document.querySelectorAll('.nav-link');
        this.contents = document.querySelectorAll('.tab-content');
        this.carousels = {};
        
        this.init();
    }

    init() {
        // Initialize carousels
        const landscapeCarousel = document.querySelector('#landscape .carousel');
        const lifestyleCarousel = document.querySelector('#lifestyle .carousel');
        
        if (landscapeCarousel) {
            this.carousels.landscape = new Carousel(landscapeCarousel);
        }
        if (lifestyleCarousel) {
            this.carousels.lifestyle = new Carousel(lifestyleCarousel);
        }

        // Add click handlers to tabs and logo
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = tab.dataset.tab;
                this.switchTab(tabId);
                this.restartCarousel(tabId);
            });
        });

        // Add click handler to logo
        const logoLink = document.querySelector('.logo-link');
        if (logoLink) {
            logoLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab('landscape');
                this.restartCarousel('landscape');
            });
        }

        // Handle initial hash
        if (window.location.hash) {
            const tabId = window.location.hash.substring(1);
            this.switchTab(tabId);
        }
    }

    restartCarousel(tabId) {
        const carousel = this.carousels[tabId];
        if (carousel) {
            carousel.currentIndex = 0;
            carousel.moveToIndex(0);
            carousel.updateOpacity();
            carousel.startAutoScroll();
        }
    }

    switchTab(tabId) {
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });

        this.contents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });

        history.pushState(null, null, `#${tabId}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tabManager = new TabManager();
    
    window.addEventListener('popstate', () => {
        const tabId = window.location.hash.substring(1) || 'landscape';
        tabManager.switchTab(tabId);
    });
}); 