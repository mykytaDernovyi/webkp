/* === 1. ЗАГАЛЬНІ СКРИПТИ (БУРГЕР, SCROLL-TO-TOP) === */

document.addEventListener('DOMContentLoaded', () => {

    const burgerMenu = document.getElementById('burgerMenu');
    const openIcon = document.getElementById('openIcon');
    const closeIcon = document.getElementById('closeIcon');
    const headerNav = document.getElementById('headerNav');

    if (burgerMenu && openIcon && closeIcon && headerNav) {
        burgerMenu.addEventListener('click', () => {
            openIcon.classList.toggle('d-none');
            closeIcon.classList.toggle('d-none');
            headerNav.classList.toggle('header-nav__open');
        });
    }

    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});


/* === 2. КАРУСЕЛЬ ВІДГУКІВ (REVIEWS) === */

document.addEventListener('DOMContentLoaded', () => {
    const reviewCarousel = document.querySelector('.reviews-wrapper .carousel');
    if (!reviewCarousel) return;

    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.reviews .nav-btn.prev');
    const nextBtn = document.querySelector('.reviews .nav-btn.next');

    if (reviewCards.length === 0 || !prevBtn || !nextBtn) return;

    let currentIndex = 1;
    const totalItems = reviewCards.length;

    function updateCarousel() {
        reviewCards.forEach((reviewCard, index) => {
            reviewCard.classList.remove('active', 'prev', 'next');
            reviewCard.style.display = 'flex';
            let newIndex = (index - currentIndex + totalItems) % totalItems;

            if (newIndex === 0) {
                reviewCard.classList.add('active');
            } else if (newIndex === 1) {
                reviewCard.classList.add('next');
            } else if (newIndex === totalItems - 1) {
                reviewCard.classList.add('prev');
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


/* === 3. ЛОГІКА СТОРІНКИ МАГАЗИНУ (SHOP PAGE) === */

document.addEventListener('DOMContentLoaded', () => {

    const productGrid = document.getElementById('product-grid');
    const sortSelect = document.getElementById('sort');
    const paginationContainer = document.getElementById('pagination-container');
    const viewOptions = document.querySelector('.view-options');

    if (!productGrid || !sortSelect || !paginationContainer || !viewOptions) {
        return;
    }

    let allProducts = [];
    let currentPage = 1;
    let itemsPerPage = 9;
    let currentLayout = 'grid-3';

    async function loadProducts() {
        try {
            const response = await fetch('./assets/data/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProducts = await response.json();
            renderPage();
        } catch (error) {
            console.error("Не вдалося завантажити товари:", error);
            productGrid.innerHTML = "<p>Помилка завантаження товарів. Будь ласка, оновіть сторінку.</p>";
        }
    }

    function renderPage() {
        let productsToDisplay = [...allProducts];

        const sortBy = sortSelect.value;
        if (sortBy === 'price-asc') {
            productsToDisplay.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            productsToDisplay.sort((a, b) => b.price - a.price);
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = productsToDisplay.slice(startIndex, endIndex);

        displayProducts(paginatedProducts);
        setupPagination(productsToDisplay.length);
        updateGridLayout();
    }

    function displayProducts(products) {
        productGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            const swatches = product.swatches || [];
            const swatchesHTML = swatches.map(color =>
                `<span class="swatch" style="background-color: ${color};"></span>`
            ).join('');

            const oldPriceHTML = product.oldPrice
                ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>`
                : '';

            const descriptionHTML = product.description
                ? `<p class="description">${product.description}</p>`
                : '';

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="price">$${product.price.toFixed(2)} ${oldPriceHTML}</p>
                    <div class="swatches">
                        ${swatchesHTML}
                    </div>
                    ${descriptionHTML}
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    function setupPagination(totalItems) {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) return;

        let pagesToShow = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pagesToShow.push(i);
            }
        } else {
            pagesToShow.push(1);
            if (currentPage > 2) pagesToShow.push('...');

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage === 1) end = 3;
            if (currentPage === totalPages) start = totalPages - 2;

            for (let i = start; i <= end; i++) {
                if (!pagesToShow.includes(i)) pagesToShow.push(i);
            }

            if (currentPage < totalPages - 1) pagesToShow.push('...');
            pagesToShow.push(totalPages);
        }

        pagesToShow.forEach(page => {
            if (page === '...') {
                const span = document.createElement('span');
                span.innerText = '...';
                paginationContainer.appendChild(span);
            } else {
                const pageLink = document.createElement('a');
                pageLink.innerText = page;
                pageLink.dataset.page = page;

                if (page === currentPage) {
                    pageLink.classList.add('active');
                }

                pageLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = Number(e.target.dataset.page);
                    renderPage();
                });
                paginationContainer.appendChild(pageLink);
            }
        });

        if (currentPage < totalPages) {
            const nextLink = document.createElement('a');
            nextLink.innerText = '»';
            nextLink.dataset.page = currentPage + 1;

            nextLink.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = Number(e.target.dataset.page);
                renderPage();
            });
            paginationContainer.appendChild(nextLink);
        }
    }

    function updateGridLayout() {
        productGrid.className = 'product-grid';
        productGrid.classList.add(`layout-${currentLayout}`);
    }

    sortSelect.addEventListener('change', () => {
        currentPage = 1;
        renderPage();
    });

    viewOptions.addEventListener('click', (e) => {
        const clickedButton = e.target.closest('.view-btn');
        if (!clickedButton) return;

        const layout = clickedButton.dataset.layout;
        const items = clickedButton.dataset.items;

        if (!layout || layout === currentLayout) return;

        currentLayout = layout;
        itemsPerPage = Number(items);
        currentPage = 1;

        viewOptions.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');

        renderPage();
    });

    loadProducts();
});


/* === 4. ЛОГІКА ФІЛЬТРІВ (АКОРДЕОН) === */

document.addEventListener('DOMContentLoaded', () => {
    const collapsibleHeaders = document.querySelectorAll('.filter-group.collapsible .filter-group-header');

    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const filterGroup = header.closest('.filter-group.collapsible');
            if (filterGroup) {
                filterGroup.classList.toggle('closed');
            }
        });
    });
});

/* === 5. МОДАЛЬНЕ ВІКНО === */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("supportBtn"); 
    const span = document.getElementsByClassName("close-modal")[0];

    if (!modal || !btn || !span) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    span.addEventListener('click', () => {
        closeModal();
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('open');
        modal.classList.add('close');
        setTimeout(() => {
            modal.classList.remove('close');
        }, 400);
        document.body.style.overflow = '';
    }
});