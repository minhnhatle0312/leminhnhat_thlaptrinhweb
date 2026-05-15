// This file contains utility functions for managing local storage, such as saving and retrieving cart data.

const storageKey = 'ecommerceCart';

export function saveCart(cart) {
    localStorage.setItem(storageKey, JSON.stringify(cart));
}

export function getCart() {
    const cart = localStorage.getItem(storageKey);
    return cart ? JSON.parse(cart) : [];
}

export function clearCart() {
    localStorage.removeItem(storageKey);
}