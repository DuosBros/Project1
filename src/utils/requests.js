import axios from 'axios';
import { MEDPHARMAVN_API, DEFAULT_ORDER_LOCK_SECONDS, SMARTFORM_KEY, DEFAULT_SMARTFORM_LIMIT } from '../appConfig';

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

export function getAddressSuggestions(street) {
    var payload = {
        "fieldType": "STREET_AND_NUMBER",
        "values": {
            "STREET_AND_NUMBER": street,
            "CITY": "",
            "ZIP": "",
            "COUNTRY": "CZ"
        },
        "limit": DEFAULT_SMARTFORM_LIMIT,
        "password": SMARTFORM_KEY
    }

    return axios.post(MEDPHARMAVN_API + "smartform", payload)
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

export function getOrder(id) {
    return axios.get(MEDPHARMAVN_API + 'orders/' + id);
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