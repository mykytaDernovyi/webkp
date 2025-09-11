const burgerMenu = document.getElementById('burgerMenu');
const openIcon = document.getElementById('openIcon');
const closeIcon = document.getElementById('closeIcon');
const headerNav = document.getElementById('headerNav');

burgerMenu.addEventListener('click', () => {
    openIcon.classList.toggle('d-none');
    closeIcon.classList.toggle('d-none');
    headerNav.classList.toggle('header-nav__open');
});

const scrollToTopBtn = document.getElementById('scrollToTop');

scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    let currentIndex = 1;
    const totalItems = reviewCards.length;
    
    function updateCarousel() {
        reviewCards.forEach((reviewCard, index) => {
            reviewCard.classList.remove('active', 'prev', 'next');
            
            if (index === currentIndex) {
                reviewCard.classList.add('active');
            } else if (index === (currentIndex - 1 + totalItems) % totalItems) {
                reviewCard.classList.add('prev');
            } else if (index === (currentIndex + 1) % totalItems) {
                reviewCard.classList.add('next');
            } else {
                reviewCard.style.display = 'none';
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    updateCarousel();
});