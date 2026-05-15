# E-commerce Web Application

This is a simple e-commerce web application built using HTML, CSS, and JavaScript. The application allows users to browse products, add them to a shopping cart, and manage their cart items.

## Project Structure

```
ecommerce-web-app
├── src
│   ├── index.html          # Main entry point of the application
│   ├── css
│   │   ├── main.css        # Main styles for the application
│   │   └── components
│   │       ├── header.css  # Styles for the header component
│   │       ├── product-card.css # Styles for product cards
│   │       └── cart.css    # Styles for the shopping cart
│   ├── js
│   │   ├── main.js         # Main JavaScript file
│   │   ├── api.js          # API functions for data fetching
│   │   ├── components
│   │   │   ├── header.js   # Header component functionality
│   │   │   ├── productCard.js # Product card functionality
│   │   │   └── cart.js     # Shopping cart functionality
│   │   └── utils
│   │       ├── dom.js      # DOM manipulation utilities
│   │       └── storage.js   # Local storage utilities
│   └── components
│       ├── header.html     # Header component HTML
│       ├── footer.html     # Footer component HTML
│       └── product-card.html # Product card component HTML
├── data
│   └── products.json       # JSON file containing product data
├── package.json            # NPM configuration file
├── .gitignore              # Files to ignore in version control
└── README.md               # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd ecommerce-web-app
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Open the application**:
   Open `src/index.html` in your web browser to view the application.

## Usage Guidelines

- Browse through the product listings.
- Click on a product to view details and add it to your cart.
- Access the shopping cart to view selected items and proceed to checkout.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.