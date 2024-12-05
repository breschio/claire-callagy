class Carousel {
    constructor(container) {
        this.container = container;
        this.items = container.querySelectorAll('.carousel-item');
        this.totalItems = this.items.length;
        this.currentIndex = 0;
        this.interval = null;
        
        this.init();
    }

    init() {
        const firstItemClone = this.items[0].cloneNode(true);
        this.container.appendChild(firstItemClone);
        
        const lastItemClone = this.items[this.totalItems - 1].cloneNode(true);
        this.container.insertBefore(lastItemClone, this.container.firstChild);
        
        this.items = this.container.querySelectorAll('.carousel-item');
        
        this.currentIndex = 1;
        
        if (this.container.classList.contains('carousel-lifestyle')) {
            this.items.forEach(item => {
                item.style.opacity = '0.3';
            });
            this.items[this.currentIndex].style.opacity = '1';
        }
        
        this.centerCurrentItem();
        this.updateActiveState();
        this.startAutoScroll();
    }

    updateActiveState() {
        const isLifestyle = this.container.classList.contains('carousel-lifestyle');
        
        this.items.forEach(item => {
            item.classList.remove('active');
            if (isLifestyle) {
                item.style.opacity = '0.3';
            }
        });
        
        const activeItem = this.items[this.currentIndex];
        activeItem.classList.add('active');
        if (isLifestyle) {
            activeItem.style.opacity = '1';
        }
        
        // Handle the loop transition
        if (this.currentIndex === this.totalItems + 1) {
            this.items[1].classList.add('active');
            if (isLifestyle) {
                this.items[1].style.opacity = '1';
            }
        }
    }

    centerCurrentItem() {
        const isLifestyle = this.container.classList.contains('carousel-lifestyle');
        const itemWidth = isLifestyle ? 450 : this.items[0].querySelector('img').offsetWidth;
        const itemMargin = 16;
        const containerWidth = this.container.parentElement.offsetWidth;
        const itemTotalWidth = itemWidth + itemMargin;
        const offset = (containerWidth - itemWidth) / 2;
        const translateX = -(this.currentIndex * itemTotalWidth) + offset;
        
        this.container.style.transform = `translateX(${translateX}px)`;
    }

    next() {
        this.container.style.transition = 'transform 0.5s ease-in-out';
        this.currentIndex++;
        
        this.updateActiveState();
        this.centerCurrentItem();

        if (this.currentIndex >= this.totalItems + 1) {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    this.container.style.transition = 'none';
                    this.currentIndex = 1;
                    this.centerCurrentItem();
                }, 500);
            });
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
        // Initialize carousels for both galleries
        const landscapeCarousel = document.querySelector('#landscape .carousel');
        const lifestyleCarousel = document.querySelector('#lifestyle .carousel');
        
        if (landscapeCarousel) {
            this.carousels.landscape = new Carousel(landscapeCarousel);
        }
        if (lifestyleCarousel) {
            this.carousels.lifestyle = new Carousel(lifestyleCarousel);
        }

        // Add click handlers to tabs
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(tab.dataset.tab);
            });
        });

        // Handle initial hash
        if (window.location.hash) {
            const tabId = window.location.hash.substring(1);
            this.switchTab(tabId);
        }
    }

    switchTab(tabId) {
        // Update active states
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });

        this.contents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });

        // Update URL without page reload
        history.pushState(null, null, `#${tabId}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tabManager = new TabManager();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const tabId = window.location.hash.substring(1) || 'landscape';
        tabManager.switchTab(tabId);
    });
}); 