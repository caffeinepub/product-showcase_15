import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Order {
    id: bigint;
    customerName: string;
    productId: bigint;
    productName: string;
    timestamp: bigint;
    contactNumber: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    imageUrl: string;
    price: string;
}
export interface backendInterface {
    addProduct(name: string, description: string, price: string, imageUrl: string, adminPin: string): Promise<Product>;
    deleteProduct(productId: bigint, adminPin: string): Promise<boolean>;
    getAllOrders(adminPin: string): Promise<Array<Order>>;
    getProducts(): Promise<Array<Product>>;
    submitOrder(productId: bigint, productName: string, customerName: string, contactNumber: string, timestamp: bigint): Promise<Order>;
}
