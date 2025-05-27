"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = validateEmail;
exports.isValidEmail = isValidEmail;
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidEmail(email) {
    if (!email) {
        return { isValid: false, message: 'Email is required' };
    }
    if (!validateEmail(email)) {
        return { isValid: false, message: 'Invalid email format' };
    }
    return { isValid: true };
}
