import { LOCALSTORAGE_NAME, successColor, warningColor, errorColor, notActiveColor } from "../appConfig";
import axios from 'axios';
import moment from "moment";
import React from 'react';


export const mapOrderToExcelExport = (data) => {
    let maxProductCount = 0;
    for (let i = 0; i < data.length; i++) {
        if (maxProductCount < data[i].products.length) {
            maxProductCount = data[i].products.length;
        }
    }

    let formattedOrders = [];

    for (let i = 0; i < data.length; i++) {
        let formattedOrder = {};
        formattedOrder.firstName = data[i].address.firstName;
        formattedOrder.lastName = data[i].address.lastName;
        formattedOrder.phone = data[i].address.phone;
        formattedOrder.street = data[i].address.street;
        formattedOrder.city = data[i].address.city;
        formattedOrder.streetNumber = data[i].address.streetNumber;
        formattedOrder.zip = data[i].address.psc;
        formattedOrder.company = data[i].address.company;
        formattedOrder.totalPrice = data[i].totalPrice;
        formattedOrder.orderDate = moment(data[i].payment.orderDate).format("DD.MM.YYYY");
        formattedOrder.paymentDate = data[i].payment.paymentDate ? moment(data[i].payment.paymentDate).format("DD.MM.YYYY") : "Not paid";

        for (let j = 0; j < maxProductCount; j++) {
            formattedOrder['product' + (j + 1)] = '';
            formattedOrder['product' + (j + 1) + ' count'] = '';
        }
        for (let j = 0; j < data[i].products.length; j++) {
            formattedOrder['product' + (j + 1)] = data[i].products[j].productName;
            formattedOrder['product' + (j + 1) + ' count'] = data[i].products[j].count;
        }

        formattedOrders.push(formattedOrder);
    }

    return formattedOrders;
}
export const flattenObject = (ob) => {
    var toReturn = {};

    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object' && ob[i] !== null) {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

export const sortMonthYear = (array) => {
    array.sort(function (a, b) {
        a = a.monthAndYear.split(".");
        b = b.monthAndYear.split(".")
        return new Date(b[1], b[0], 1) - new Date(a[1], a[0], 1)
    })

    return array;
}

/**
 *
 * @param {boolean} isAuthenticated
 * @param {string} token
 */
export const handleLocalStorageToken = (isAuthenticated, token) => {

    if (isAuthenticated) {
        let localStorageToken = localStorage.getItem(LOCALSTORAGE_NAME)
        if (!localStorageToken && token) {
            localStorage.setItem(LOCALSTORAGE_NAME, token)
            axios.defaults.headers.common['x-access-token'] = token;
        }

        return;
    }

    // if authentication is not successful
    if (!token) localStorage.removeItem(LOCALSTORAGE_NAME)
}

/**
 *
 * @param {functionCall} fn
 * @param {number} time
 */
export const debounce = (fn, time) => {
    let timeout;

    return function () {
        const functionCall = () => fn.apply(this, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}

/**
 *
 * @param {string} timestamp in ISO
 */
export const verifyOrderTimestamp = (timestamp) => {
    if (!timestamp) return false

    return moment(timestamp).isAfter(moment())
}

/**
 *
 * @param {object} parentProps
 * @param {object} error
 * @param {string} currentUser
 */
export const handleVerifyLockError = (parentProps, error, currentUser) => {
    if (error.response) {
        if (error.response.data) {
            if (error.response.data.message) {
                if (error.response.data.message.lockedBy !== currentUser) {
                    parentProps.showGenericModalAction({
                        modalContent: (
                            <span>
                                This order is locked by <strong>{error.response.data.message.lockedBy}</strong>!
                    </span>
                        ),
                        modalHeader: "Locked order",
                        redirectTo: '/orders',
                        parentProps: parentProps
                    })

                }
            }
        }
    }
    else {
        parentProps.showGenericModalAction({
            modalContent: (
                <span>
                    Details:
        </span>
            ),
            redirectTo: '/orders',
            parentProps: parentProps,
            err: error
        })
    }
}

/**
 *
 * @param {string} sourceString
 * @param {string} pattern
 */
export const contains = (sourceString, pattern) => {
    return sourceString.toString().search(new RegExp(pattern, "i")) >= 0
}

/*
 * "keys" (optional) Specifies which properties of objects should be inspected.
 *                   If omitted, all properties will be inspected.
 */
export const filterInArrayOfObjects = (filter, array, keys) => {
    return array.filter(element => {
        let objk = keys ? keys : Object.keys(element);
        for (let key of objk) {
            if (element[key] !== undefined &&
                element[key] !== null &&
                filter(element[key])
            ) { // fuken lodash returning isEmpty true for numbers
                return true;
            }
        }
        return false;
    });
}

/**
 *
 * @param {object} order
 */
export const getOrderTableRowStyle = (order) => {
    var backgroundColor;

    if (!order) {
        return null
    }

    if (order.payment.paid) {
        backgroundColor = successColor
    }
    else if (order.zaslatDate && !order.payment.paid) {
        backgroundColor = warningColor
    }
    else if (!order.zaslatDate && order.state === "active") {
        backgroundColor = errorColor
    }
    else {
        backgroundColor = notActiveColor
    }

    return { backgroundColor: backgroundColor }
}

/**
 * @param {number} weight
 */
export const getGLSDeliveryPrice = (weight) => {
    // weight of the box
    weight += 500
    if (weight < 3000)
        return 111
    if (weight < 5000)
        return 116
    if (weight < 10000)
        return 127
    if (weight < 15000)
        return 139
}

const REGEX_DIGITS = /^\d+$/;
/**
 *
 * @param {*} value
 */
export const isNum = (value) => {
    if (value === null || value === undefined) {
        return false;
    }
    const valueString = value.toString();

    const length = valueString.length;
    var isNum = REGEX_DIGITS.test(valueString);

    if (length > 0 && isNum) {
        return true;
    }
    else {
        return false;
    }
}

/**
 *
 * @param {Array} array
 * @param {Array} keys
 */
export const pick = (array, keys) => {
    return array.map(x => {
        return keys.map(k => k in x ? { [k]: x[k] } : {})
            .reduce((res, o) => Object.assign(res, o), {})
    })
}