// src/utils/index.js
const generateOrderId = () => {
    // Example implementation - you can customize this
    return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

module.exports = {
    generateOrderId
};