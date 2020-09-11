export function isvalidUsername(str) {
    return str.trim().length >= 3
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}
