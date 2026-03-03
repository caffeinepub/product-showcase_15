# Product Showcase & Order Collection

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A product catalog page displaying products with name, description, price, and image
- An "Order Now" button on each product card
- A modal/dialog that appears when "Order Now" is clicked, asking for the customer's name and contact number
- A backend to store submitted orders (customer name, phone number, product name, timestamp)
- An admin view (password-protected) where the shop owner can see all submitted orders with customer details

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend (Motoko):
   - Data model: Product (id, name, description, price, imageUrl) stored as stable array
   - Data model: Order (id, productId, productName, customerName, contactNumber, timestamp)
   - Functions: getProducts, submitOrder, getOrders (admin), addProduct, seedProducts
   - Simple admin PIN check for getOrders

2. Frontend:
   - Home/Product listing page with product cards (image, name, description, price, Order Now button)
   - Order modal with form fields: Full Name, Contact Number, submit button
   - Success confirmation after order is submitted
   - Admin page (route /admin) with PIN entry and orders table showing all leads
   - Sample products pre-loaded for demo purposes
