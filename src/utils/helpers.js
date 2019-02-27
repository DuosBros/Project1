import { LOCALSTORAGE_NAME, successColor, warningColor, errorColor, notActiveColor } from "../appConfig";
import axios from 'axios';
import moment from "moment";
import React from 'react';

/**
 *
 * @param {boolean} isAuthenticated
 * @param {string} token
 */
export const handleLocalStorageToken = (isAuthenticated, token) => {

    if (isAuthenticated) {
        let localStorageToken = localStorage.getItem(LOCALSTORAGE_NAME)
        if (!localStorageToken) {
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

/*
 * "keys" (optional) Specifies which properties of objects should be inspected.
 *                   If omitted, all properties will be inspected.
 */
export const filterInArrayOfObjects = (toSearch, array, keys) => {
    toSearch = trimString(toSearch); // trim it
    return array.filter(element => {
        let objk = keys ? keys : Object.keys(element);
        for (let key of objk) {
            if (element[key]) { // fuken lodash returning isEmpty true for numbers
                if (element[key].toString().toLowerCase().indexOf(toSearch.toString().toLowerCase()) !== -1) {
                    return true
                }
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

// -------------------------------------------------------------------------

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

function trimString(s) {
    var l = 0, r = s.length - 1;
    while (l < s.length && s[l] === ' ') l++;
    while (r > l && s[r] === ' ') r -= 1;
    return s.substring(l, r + 1);
}