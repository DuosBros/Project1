import axios from 'axios';
import { MEDPHARMAVN_API, DEFAULT_ORDER_LOCK_SECONDS } from '../appConfig';

//{"name":"Test","price":1,"weight":20,"tax":21}
export function createProduct(product) {
    return axios.post(MEDPHARMAVN_API + 'products', product)
}

export function editProduct(product) {
    return axios.put(MEDPHARMAVN_API + 'products/' + product.name, product)
}

export function getWarehouseProducts() {
    return axios.get(MEDPHARMAVN_API + 'warehouse/products')
}

/**
 *
 * @param {Number} costId
 */
export function deleteCost(costId) {
    return axios.delete(MEDPHARMAVN_API + 'costs/' + costId)
}

/**
 *
 * @param {Object} cost
 */
export function createCost(cost) {
    return axios.post(MEDPHARMAVN_API + 'costs', cost)
}

/**
 *
 * @param {Object} cost
 */
export function editCost(cost) {
    return axios.put(MEDPHARMAVN_API + 'costs/' + cost.id, cost)
}

/**
 * Export data to excel
 * @param {Array} data
 * @param {string} fileName
 * @param {string} sheetName
 */
export function exportDataToExcel(data, fileName, sheetName) {
    return axios.post(MEDPHARMAVN_API + 'export/' + fileName + '/' + sheetName, data, { responseType: 'blob' })
}

/**
 * Send authentication payload
 * @param {object} payload
 */
export function sendAuthenticationData(payload) {
    return axios.post(MEDPHARMAVN_API + 'authenticate', payload);
}

/**
 * Validate localStorage token
 */
export function validateToken() {
    // get from (start of year) and to (end of year) date
    var from = new Date(new Date().getUTCFullYear(), 0, 0, 24, 59, 59).toISOString();
    var to = new Date(new Date().getUTCFullYear(), 12, 0, 24, 59, 59).toISOString();

    // limit 1 -> its enough to know if token is valid
    // axios.defaults.headers.common['x-access-token'] (see helpers.js)
    return axios.get(MEDPHARMAVN_API +
        'orders?from=' +
        from +
        '&to=' +
        to +
        '&limit=1')
}

/**
 *
 * @param {object} order
 */
export function updateOrder(order, user) {
    return axios.put(MEDPHARMAVN_API + 'orders/' + order.id + '?username=' + user, order)
}

/**
 *
 * @param {int} id
 */
export function getOrder(id) {
    return axios.get(MEDPHARMAVN_API + 'orders/' + id)
}

/**
 *
 * @param {object} payload
 */
export function printLabels(payload) {
    return axios.post(MEDPHARMAVN_API + 'zaslat/shipments/label', payload)
}

export function deleteOrder(id) {
    return axios.delete(MEDPHARMAVN_API + 'orders/' + id)
}

/**
 * Get the senders for Zaslat
 */
export function getSenders() {
    return axios.get(MEDPHARMAVN_API + 'config/senders')
}

/**
 *
 * @param {object} payload
 */
export function orderDelivery(payload) {
    return axios.post(MEDPHARMAVN_API + 'zaslat/shipments/create', payload)
}

/**
 * Get all costs
 */
export function getCosts() {
    return axios.get(MEDPHARMAVN_API + 'costs')
}

/**
 *
 * @param {object} cost
 */
export function addCost(cost) {
    return axios.post(MEDPHARMAVN_API + 'costs', cost)
}

// ----------------------------------------------------------------------------------------

export function getInvoice(orderId) {
    return axios.get(MEDPHARMAVN_API + "pdf/orders/" + orderId)
}

export function getAllZaslatOrders() {
    return axios.get(MEDPHARMAVN_API + 'zaslat/orders/list')
}

export function getHighestVS() {
    return axios.get(MEDPHARMAVN_API + "orders/vs/next")
}

export function verifyLock(orderId, user) {
    return axios.get(MEDPHARMAVN_API + 'orders/' + orderId + '/lock?username=' + user)
}

export function lockOrder(orderId, user, seconds) {
    if (!seconds) {
        seconds = DEFAULT_ORDER_LOCK_SECONDS
    }

    return axios.put(MEDPHARMAVN_API + 'orders/' + orderId + '/lock?username=' + user + "&seconds=" + seconds)
}

export function unlockOrder(orderId, user) {
    return axios.put(MEDPHARMAVN_API + 'orders/' + orderId + '/unlock?username=' + user)
}

export function saveOrder(order, user) {
    return axios.put(MEDPHARMAVN_API + 'orders/' + order.id + '?username=' + user, order)
}

export function createOrder(order, user) {
    return axios.post(MEDPHARMAVN_API + 'orders?username=' + user, order)
}

export function getAllProducts() {
    return axios.get(MEDPHARMAVN_API + 'products/allproducts')
}

export function getCurrentYearOrders(limit, sinceId) {
    var from = new Date(new Date().getUTCFullYear() - 1, 0, 0, 24, 59, 59).toISOString();
    var to = new Date(new Date().getUTCFullYear(), 12, 0, 24, 59, 59).toISOString();

    if (!limit) {
        return axios.get(MEDPHARMAVN_API +
            'orders?from=' +
            from +
            '&to=' +
            to
        )
    }

    if (sinceId) {
        return axios.get(MEDPHARMAVN_API +
            'orders?from=' +
            from +
            '&to=' +
            to +
            '&limit=' + limit +
            '&sinceId=' + sinceId)

    }
    else {
        return axios.get(MEDPHARMAVN_API +
            'orders?from=' +
            from +
            '&to=' +
            to +
            '&limit=' + limit)
    }
}

// /orders?from=December 31, 2017 23:59:59&to=December%2031,%202018%2023:59:59&limit=100

export function getBankTransactions() {
    return axios.get(MEDPHARMAVN_API + 'bank/transactions')
}

export function getWarehouseNotifications() {
    return axios.get(MEDPHARMAVN_API + "warehouseNotifications")
}

export function getNotPaidNotificationsNotifications() {
    return axios.get(MEDPHARMAVN_API + "notPaidNotifications")
}