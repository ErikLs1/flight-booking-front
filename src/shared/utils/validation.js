// Validations
export function validateEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
}

export function validateName(name) {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(name);
}

export function validatePhone(phone) {
    const phoneRegex = /^\+\d+$/;
    return phoneRegex.test(phone);
}