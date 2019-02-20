import { LOCALSTORAGE_NAME } from "../appConfig";
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
                                This order is locked by <b>{error.response.data.message.lockedBy}</b>!
                    </span>
                        ),
                        modalHeader: "Locked order",
                        redirectTo: '/orders',
                        parentProps: parentProps
                    })

                }
                else {
                    return true
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

function compareObjects(o1, o2) {
    var k = '';
    for (k in o1) if (o1[k] !== o2[k]) return false;
    for (k in o2) if (o1[k] !== o2[k]) return false;
    return true;
}

function itemExists(haystack, needle) {
    for (var i = 0; i < haystack.length; i++) if (compareObjects(haystack[i], needle)) return true;
    return false;
}


export const filterInArrayOfObjects = (toSearch, array) => {
    var results = [];
    toSearch = trimString(toSearch); // trim it
    for (var i = 0; i < array.length; i++) {
        Object.keys(array[i]).map((key, index) => {
            if (array[i][key]) { // fuken lodash returning isEmpty true for numbers
                if (array[i][key].toString().toLowerCase().indexOf(toSearch.toString().toLowerCase()) !== -1) {
                    if (!itemExists(results, array[i])) results.push(array[i]);
                }
            }
        })
    }
    return results;
}

