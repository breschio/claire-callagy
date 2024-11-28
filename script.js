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
        this.cloneItems();
        this.centerCurrentItem();
        this.updateActiveState();
        this.startAutoScroll();
    }

    cloneItems() {
        const firstClones = Array.from(this.items).map(item => item.cloneNode(true));
        const lastClones = Array.from(this.items).map(item => item.cloneNode(true));
        
        firstClones.forEach(clone => this.container.appendChild(clone));
        lastClones.reverse().forEach(clone => this.container.insertBefore(clone, this.container.firstChild));
        
        this.items = document.querySelectorAll('.carousel-item');
    }

    updateActiveState() {
        this.items.forEach(item => item.classList.remove('active'));
        this.items[this.currentIndex + this.totalItems].classList.add('active');
    }

    centerCurrentItem() {
        const itemWidth = this.items[0].offsetWidth;
        const itemMargin = 16;
        const containerWidth = this.container.parentElement.offsetWidth;
        const itemTotalWidth = itemWidth + itemMargin;
        const offset = (containerWidth - itemWidth) / 2;
        const translateX = -((this.currentIndex + this.totalItems) * itemTotalWidth) + offset;
        
        this.container.style.transform = `translateX(${translateX}px)`;
    }

    next() {
        this.currentIndex++;
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