import { createOrder, getHighestVS, saveOrder } from "../../utils/requests";
import { getGLSDeliveryPrice } from "../../utils/helpers";
import { deliveryTypes, LOCALSTORAGE_NAME, deliveryCompanies } from "../../appConfig";
import moment from 'moment';
import _ from 'lodash';

export const handleOrder = async (order, mode, props) => {
    if (order.deliveryType === deliveryTypes[1].type) {
        delete order.deliveryCompany
        delete order.payment.cashOnDelivery
        delete order.payment.vs
        delete order.payment.price
    }
    else {
        let res = await getHighestVS();
        order.payment.vs = res.data
    }

    order.products.forEach(x => {
        delete x.product
    })

    // TODO: add branch picker
    order.branch = order.branch ? order.branch : "VN"

    order.address.street = document.getElementById("hiddenStreet").value
    order.address.city = document.getElementById("city").value
    order.address.psc = document.getElementById("zip").value
    order.address.streetNumber = document.getElementById("hiddenStreetNumber").value

    order.totalPrice = getTotalPriceHelper(true, order);

    order.address.firstName = document.getElementById("firstName").value
    order.address.lastName = document.getElementById("lastName").value
    order.address.phone = document.getElementById("phone").value
    order.address.company = document.getElementById("company").value

    order.payment.price = document.getElementById("deliveryPrice").value ? parseInt(document.getElementById("deliveryPrice").value) : null
    order.note = document.getElementById("note").value

    var user = localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : ""

    if (mode === "create") {
        order.payment.orderDate = moment().toISOString()

        createOrder(order, user)
            .then(() => {
                props.history.push('/orders')
            })
            .catch((err) => {
                props.showGenericModalAction({
                    header: 'Failed to create order',
                    parentProps: this.props,
                    err: err
                })
            })
    }
    else {
        saveOrder(order, user)
            .then(() => {
                props.history.push('/orders')
            })
            .catch((err) => {
                props.showGenericModalAction({
                    header: 'Failed to update order: ' + order.id,
                    parentProps: this.props,
                    err: err
                })
            })
    }
}

export const handleProductDropdownOnChangeHelper = (product, stateOrder, i) => {
    if (_.isNaN(product.count)) {
        product.count = ""
    }

    if (_.isNumber(product.count) || _.isNumber(product.pricePerOne)) {
        product.totalPricePerProduct = product.pricePerOne * product.count
    }
    else {
        product.totalPricePerProduct = ""
    }

    var o = Object.assign({}, stateOrder)
    o.products[i] = product;
    document.getElementById("deliveryPrice").value = getGLSDeliveryPrice(
        o.products.map(x => x.product.weight).reduce((a, b) => a + b, 0))

    return o;
}

export const handleInputChangeHelper = (name, value, prop, stateOrder) => {
    var o = Object.assign({}, stateOrder)
    if (_.isEmpty(prop)) {
        if (_.isNumber(o[name])) {
            o[name] = Number(value)
        }
        else {
            o[name] = value
        }
    }
    else {
        if (_.isNumber(o[prop][name])) {
            o[prop][name] = Number(value)
        }
        else {
            o[prop][name] = value
        }
    }

    return o;
}

export const getTotalPriceHelper = (raw, orderState) => {
    var sum = 0;

    if (document.getElementById("deliveryPrice")) {
        var parsed = parseInt(document.getElementById("deliveryPrice").value)
        if (!isNaN(parsed)) {
            sum = parsed
        }
    }

    orderState.products.forEach(product => {
        sum += product.count * product.pricePerOne
    });

    if (raw) {
        return sum
    }
    else {
        // adding space after 3 digits
        return sum.toLocaleString('cs-CZ');
    }
}

export const handleToggleDeliveryButtonsHelper = (prop, type, stateOrder) => {
    var o = Object.assign({}, stateOrder)
    if ((prop === "deliveryType" && type === deliveryTypes[0].type) || (prop === "deliveryCompany" && type === deliveryCompanies[0].company)) {
        o.payment.price = getGLSDeliveryPrice(o.products.map(x => x.product.weight).reduce((a, b) => a + b, 0))
    }
    else {
        o.payment.price = 0
    }

    o[prop] = type

    return o;
}

export const handleToggleBankAccountPaymentButtonsHelper = (type, stateOrder) => {
    var o = Object.assign({}, stateOrder)
    o.payment.cashOnDelivery = type

    return o;
}

export const removeProductFromOrder = (index, stateOrder) => {
    var o = Object.assign({}, stateOrder)
    o.products.splice(index, 1);
    return o;
}