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
        const firstItemClone = this.items[0].cloneNode(true);
        this.container.appendChild(firstItemClone);
        
        const lastItemClone = this.items[this.totalItems - 1].cloneNode(true);
        this.container.insertBefore(lastItemClone, this.container.firstChild);
        
        this.items = document.querySelectorAll('.carousel-item');
        
        this.currentIndex = 1;
        
        this.centerCurrentItem();
        this.updateActiveState();
        this.startAutoScroll();
    }

    updateActiveState() {
        this.items.forEach(item => item.classList.remove('active'));
        this.items[this.currentIndex].classList.add('active');
        
        if (this.currentIndex === this.totalItems + 1) {
            this.items[1].classList.add('active');
        }
    }

    centerCurrentItem() {
        const itemWidth = this.items[0].offsetWidth;
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

document.addEventListener('DOMContentLoaded', () => {
    const carousel = new Carousel();
    
    window.addEventListener('resize', () => {
        carousel.centerCurrentItem();
    });
}); 