import axios from 'axios';
import { MEDPHARMAVN_API } from '../appConfig';

export function verifyLock(orderId, user) {
    return axios.get(MEDPHARMAVN_API + 'orders/' + orderId + '/lock?username=' + user)
}

export function saveOrder(order, user) {
    return axios.put(MEDPHARMAVN_API + 'orders/' + order.id + '?username=' + user, order)
}

export function getAllProducts() {
    return axios.get(MEDPHARMAVN_API + 'products/allproducts')
}

export function sendAuthenticationData(payload) {
    return axios.post(MEDPHARMAVN_API + 'authenticate', payload);
}

export function validateToken() {
    var from = new Date(new Date().getUTCFullYear(), 0, 0, 24, 59, 59).toISOString();
    var to = new Date(new Date().getUTCFullYear(), 12, 0, 24, 59, 59).toISOString();

    return axios.get(MEDPHARMAVN_API +
        'orders?from=' +
        from +
        '&to=' +
        to +
        '&limit=1')
}

export function getOrder(id) {
    return axios.get(MEDPHARMAVN_API + 'orders/' + id);
}

export function getCurrentYearOrders(limit, sinceId) {
    var from = new Date(new Date().getUTCFullYear(), 0, 0, 24, 59, 59).toISOString();
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