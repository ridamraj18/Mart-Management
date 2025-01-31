let products = JSON.parse(localStorage.getItem('products')) || [];
let sales = JSON.parse(localStorage.getItem('sales')) || [];
let customers = JSON.parse(localStorage.getItem('customers')) || [];

// Function to calculate and display inventory summary
function calculateInventory() {
    let totalStock = 0;
    let totalInventoryValue = 0;

    // Loop through the products to calculate total stock and total inventory value
    products.forEach((product) => {
        totalStock += product.quantity;
        totalInventoryValue += product.quantity * product.costPrice;
    });

    // Update the inventory section on the page
    document.getElementById('total-stock').textContent = totalStock;
    document.getElementById('total-inventory-value').textContent = totalInventoryValue.toFixed(2);

    // Calculate Profit/Loss
    let totalSalesAmount = 0;
    let totalProfitLoss = 0;

    sales.forEach((sale) => {
        totalSalesAmount += sale.saleAmount;
    });

    // Calculate profit or loss based on the cost price
    products.forEach((product) => {
        const initialStock = product.initialQuantity;
        const currentStock = product.quantity;
        const soldQuantity = initialStock - currentStock;
        totalProfitLoss += (product.price - product.costPrice) * soldQuantity;
    });

    document.getElementById('total-sales').textContent = totalSalesAmount.toFixed(2);
    document.getElementById('total-profit-loss').textContent = totalProfitLoss.toFixed(2);

    // Display profit or loss status
    if (totalProfitLoss > 0) {
        document.getElementById('profit-loss-status').textContent = 'Profit';
    } else if (totalProfitLoss < 0) {
        document.getElementById('profit-loss-status').textContent = 'Loss';
    } else {
        document.getElementById('profit-loss-status').textContent = 'Break Even';
    }
}

// Function to add or update a product
function addOrUpdateProduct() {
    const productName = document.getElementById('product-name').value.trim();
    const productCategory = document.getElementById('product-category').value.trim();
    const productPrice = parseFloat(document.getElementById('product-price').value.trim());
    const productCostPrice = parseFloat(document.getElementById('product-cost-price').value.trim());
    const productQuantity = parseInt(document.getElementById('product-quantity').value.trim());
    const productSupplier = document.getElementById('product-supplier').value.trim();
    const productSKU = document.getElementById('product-sku').value.trim();
    const productDescription = document.getElementById('product-description').value.trim();

    // Validate inputs
    if (!productName || !productCategory || isNaN(productPrice) || isNaN(productCostPrice) || isNaN(productQuantity) || !productSupplier || !productSKU || !productDescription) {
        alert('Please fill all fields correctly.');
        return;
    }

    const product = {
        name: productName,
        category: productCategory,
        price: productPrice,
        costPrice: productCostPrice,
        quantity: productQuantity,
        supplier: productSupplier,
        sku: productSKU,
        description: productDescription,
        initialQuantity: productQuantity // Track initial quantity for inventory calculations
    };

    const editProductIndex = parseInt(localStorage.getItem('editProductIndex')) || -1;

    if (editProductIndex >= 0) {
        products[editProductIndex] = product; // Update existing product
        localStorage.removeItem('editProductIndex'); // Reset edit mode
    } else {
        products.push(product); // Add new product
    }

    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(products));

    clearProductForm();
    displayProducts();
    calculateInventory(); // Recalculate inventory after adding/updating product
}

// Function to add a sale
function addSale() {
    const productName = document.getElementById('sale-product-name').value;
    const saleQuantity = parseInt(document.getElementById('sale-quantity').value);

    const product = products.find((prod) => prod.name === productName);

    if (product && product.quantity >= saleQuantity) {
        product.quantity -= saleQuantity; // Decrease stock by the sold quantity
        const saleAmount = saleQuantity * product.price;

        // Record the sale
        sales.push({
            productName: product.name,
            quantitySold: saleQuantity,
            saleAmount: saleAmount,
        });

        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(products)); // Update product stock in localStorage
        localStorage.setItem('sales', JSON.stringify(sales)); // Save sales to localStorage

        displayProducts();
        calculateInventory(); // Recalculate inventory after sale
        displaySales();
    } else {
        alert("Insufficient stock for sale.");
    }
}

// Function to display products in the product list
function displayProducts() {
    const productList = document.getElementById('product-list');
    const saleProductName = document.getElementById('sale-product-name');
    productList.innerHTML = '';
    saleProductName.innerHTML = '<option value="" disabled selected>Select a product</option>'; // Clear the existing options in sale dropdown

    products.forEach((product, index) => {
        const productElement = document.createElement('div');
        productElement.innerHTML = `
            <p>${product.name} - ₹${product.price} | Stock: ${product.quantity} | Profit/Loss: ₹${(product.price - product.costPrice) * (product.initialQuantity - product.quantity).toFixed(2)}
                <br> Supplier: ${product.supplier} | SKU: ${product.sku}
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            </p>
        `;
        productList.appendChild(productElement);

        // Add product options to sale dropdown
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        saleProductName.appendChild(option);
    });
}

// Function to display sales
function displaySales() {
    const salesList = document.getElementById('sales-list');
    salesList.innerHTML = '';
    sales.forEach((sale, index) => {
        const saleElement = document.createElement('div');
        saleElement.innerHTML = `
            <p>${sale.productName} - ₹${sale.saleAmount} (Quantity: ${sale.quantitySold}) 
                <button onclick="deleteSale(${index})">Delete</button>
            </p>
        `;
        salesList.appendChild(saleElement);
    });
}

function addCustomer() {
    const customerName = document.getElementById('customer-name').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    const customerEmail = document.getElementById('customer-email').value.trim();
    const customerAddress = document.getElementById('customer-address').value.trim();

    // Validate inputs
    if (!customerName || !customerPhone || !customerEmail || !customerAddress) {
        alert('Please fill all customer fields correctly.');
        return;
    }

    const customer = {
        id: Date.now(), // Unique identifier for the customer
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress,
    };

    const editCustomerIndex = localStorage.getItem('editCustomerIndex');
    if (editCustomerIndex !== null) {
        customers[parseInt(editCustomerIndex)] = customer; // Update customer at the specified index
        localStorage.removeItem('editCustomerIndex'); // Reset edit mode
    } else {
        customers.push(customer); // Add a new customer
    }

    // Save to localStorage
    localStorage.setItem('customers', JSON.stringify(customers));

    clearCustomerForm(); // Reset form
    displayCustomers(); // Refresh the customer list
}

// Function to display customers
function displayCustomers() {
    const customerList = document.getElementById('customer-list');
    customerList.innerHTML = '';
    customers.forEach((customer, index) => {
        const customerElement = document.createElement('div');
        customerElement.innerHTML = `
            <p>${customer.name} - ${customer.phone} | ${customer.email} | ${customer.address}
                <button onclick="editCustomer(${index})">Edit</button>
                <button onclick="deleteCustomer(${index})">Delete</button>
            </p>
        `;
        customerList.appendChild(customerElement);
    });
}

// Function to show specific section
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Display all sections on load
function loadPageData() {
    displayProducts();
    displaySales();
    displayCustomers();
    calculateInventory();
}

// Function to edit a product
function editProduct(index) {
    const product = products[index];
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-cost-price').value = product.costPrice;
    document.getElementById('product-quantity').value = product.quantity;
    document.getElementById('product-supplier').value = product.supplier;
    document.getElementById('product-sku').value = product.sku;
    document.getElementById('product-description').value = product.description;

    // Set the index for editing in localStorage
    localStorage.setItem('editProductIndex', index);
    document.getElementById('add-product-btn').textContent = 'Update Product';
}

// Function to delete a product
function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        products.splice(index, 1); // Remove product
        localStorage.setItem('products', JSON.stringify(products)); // Update localStorage
        displayProducts(); // Refresh product list
        calculateInventory(); // Recalculate inventory
    }
}

// Function to delete a sale
function deleteSale(index) {
    if (confirm('Are you sure you want to delete this sale?')) {
        const sale = sales.splice(index, 1)[0]; // Remove sale
        const product = products.find(p => p.name === sale.productName);
        if (product) {
            product.quantity += sale.quantitySold; // Restore the stock
            localStorage.setItem('products', JSON.stringify(products)); // Update product stock in localStorage
            localStorage.setItem('sales', JSON.stringify(sales)); // Save updated sales to localStorage
            calculateInventory(); // Recalculate inventory after deletion
            displaySales(); // Refresh sale list
        }
    }
}

// Function to edit a customer
function editCustomer(index) {
    const customer = customers[index];
    document.getElementById('customer-id').value = customer.id || '';
    document.getElementById('customer-name').value = customer.name;
    document.getElementById('customer-phone').value = customer.phone;
    document.getElementById('customer-email').value = customer.email;
    document.getElementById('customer-address').value = customer.address;
}

// Function to delete a customer
function deleteCustomer(index) {
    if (confirm('Are you sure you want to delete this customer?')) {
        customers.splice(index, 1); // Remove customer
        localStorage.setItem('customers', JSON.stringify(customers)); // Update localStorage
        displayCustomers(); // Refresh customer list
    }
}

// Function to clear the product form after adding/updating
function clearProductForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-category').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-cost-price').value = '';
    document.getElementById('product-quantity').value = '';
    document.getElementById('product-supplier').value = '';
    document.getElementById('product-sku').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('add-product-btn').textContent = 'Add Product';
}

// Load data and display it when the page is loaded
window.onload = loadPageData;