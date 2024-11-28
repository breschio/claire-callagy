class Carousel {
    constructor() {
        this.container = document.querySelector('.carousel');
        this.items = document.querySelectorAll('.carousel-item');
        this.totalItems = this.items.length;
        this.currentIndex = 0;
        this.interval = null;
        
        this.init();
    }

    init() {
        // Center the first item initially
        this.centerCurrentItem();
        this.updateActiveState();
        this.startAutoScroll();
    }

    updateActiveState() {
        this.items.forEach(item => item.classList.remove('active'));
        this.items[this.currentIndex].classList.add('active');
    }

    centerCurrentItem() {
        // Calculate the position to center the current item
        const itemWidth = this.items[0].offsetWidth;
        const containerWidth = this.container.parentElement.offsetWidth;
        const offset = (containerWidth - itemWidth) / 2;
        const translateX = -(this.currentIndex * itemWidth) + offset;
        
        this.container.style.transform = `translateX(${translateX}px)`;
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalItems;
        this.centerCurrentItem();
        this.updateActiveState();
    }

    startAutoScroll() {
        this.interval = setInterval(() => this.next(), 3000);
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new Carousel();
    
    // Recenter on window resize
    window.addEventListener('resize', () => {
        carousel.centerCurrentItem();
    });
}); 