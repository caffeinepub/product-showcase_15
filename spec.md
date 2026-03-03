# Product Showcase

## Current State
A product showcase app with a public homepage displaying products with an "Order Now" button, and an admin page at /admin protected by PIN 1234. The admin page shows all customer orders and allows adding new products. There is no way to delete existing products.

## Requested Changes (Diff)

### Add
- `deleteProduct(productId: Nat, adminPin: Text)` backend function that validates the PIN and removes a product by ID
- `useDeleteProduct` hook in useQueries.ts for the delete mutation
- A "Manage Products" section in AdminPage showing all current products with a Delete button per product

### Modify
- AdminPage to include a product list with delete buttons after the orders table

### Remove
- Nothing removed

## Implementation Plan
1. Regenerate backend with deleteProduct function added
2. Add useDeleteProduct mutation hook to useQueries.ts
3. Add a "Manage Products" section in AdminPage.tsx that lists all products with a Delete button per row
