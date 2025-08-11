// Product data and functionality
const products = {
    men: [
        {
            id: 1,
            name: "Classic Oxford Shirt",
            description: "Premium cotton oxford shirt perfect for business or casual wear",
            price: 89.99,
            image: "https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "men"
        },
        {
            id: 2,
            name: "Slim Fit Chinos",
            description: "Comfortable and stylish chinos for everyday wear",
            price: 79.99,
            image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "men"
        },
        {
            id: 3,
            name: "Wool Blend Blazer",
            description: "Sophisticated blazer for professional occasions",
            price: 249.99,
            image: "https://images.pexels.com/photos/1972115/pexels-photo-1972115.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "men"
        },
        {
            id: 4,
            name: "Casual Polo Shirt",
            description: "Comfortable polo shirt for weekend activities",
            price: 59.99,
            image: "https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "men"
        },
        {
            id: 5,
            name: "Denim Jeans",
            description: "Classic straight-fit jeans in premium denim",
            price: 99.99,
            image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "men"
        },
        {
            id: 6,
            name: "Leather Dress Shoes",
            description: "Handcrafted leather shoes for formal occasions",
            price: 199.99,
            image: "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
            category: "men"
        }
    ],
    women: [
        {
            id: 7,
            name: "Silk Blouse",
            description: "Elegant silk blouse perfect for office or evening wear",
            price: 129.99,
            image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "women"
        },
        {
            id: 8,
            name: "A-Line Midi Dress",
            description: "Versatile midi dress suitable for any occasion",
            price: 159.99,
            image: "https://images.pexels.com/photos/7679582/pexels-photo-7679582.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "women"
        },
        {
            id: 9,
            name: "Cashmere Sweater",
            description: "Luxurious cashmere sweater for ultimate comfort",
            price: 299.99,
            image: "https://images.pexels.com/photos/7679618/pexels-photo-7679618.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "women"
        },
        {
            id: 10,
            name: "High-Waisted Trousers",
            description: "Tailored trousers with a flattering high-waist cut",
            price: 119.99,
            image: "https://images.pexels.com/photos/7679739/pexels-photo-7679739.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "women"
        },
        {
            id: 11,
            name: "Designer Handbag",
            description: "Premium leather handbag with elegant design",
            price: 349.99,
            image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "women"
        },
        {
            id: 12,
            name: "Wool Coat",
            description: "Warm and stylish wool coat for winter",
            price: 399.99,
            image: "https://images.pexels.com/photos/7679739/pexels-photo-7679739.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "women"
        }
    ]
};

class ProductManager {
    constructor() {
        this.currentCategory = this.getCurrentCategory();
        this.currentProducts = products[this.currentCategory] || [];
        this.init();
    }

    getCurrentCategory() {
        const path = window.location.pathname;
        if (path.includes('men.html')) return 'men';
        if (path.includes('women.html')) return 'women';
        return 'all';
    }

    init() {
        this.renderProducts();
        this.setupSorting();
    }

    renderProducts(productsToRender = this.currentProducts) {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        if (productsToRender.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or check back later.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = productsToRender.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart" onclick="productManager.addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupSorting() {
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }
    }

    sortProducts(sortBy) {
        let sortedProducts = [...this.currentProducts];

        switch (sortBy) {
            case 'price-low':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'featured':
            default:
                // Keep original order for featured
                break;
        }

        this.renderProducts(sortedProducts);
    }

    addToCart(productId) {
        const product = this.findProductById(productId);
        if (product && window.luxeStore) {
            window.luxeStore.addToCart(product);
        }
    }

    findProductById(id) {
        // Search in all categories
        for (const category in products) {
            const product = products[category].find(p => p.id === id);
            if (product) return product;
        }
        return null;
    }
}

// Initialize product manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
});

// Make products available globally for other scripts
window.products = products;