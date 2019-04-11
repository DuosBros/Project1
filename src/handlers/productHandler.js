import { getAllProducts, getWarehouseProducts } from "../utils/requests";

export const fetchAndHandleProducts = (getAllProductsAction, showGenericModalAction, genericModalProps) => {
    getAllProducts()
        .then(res => {
            getAllProductsAction({ success: true, data: res.data })
        })
        .catch(err => {
            getAllProductsAction({ success: false, error: err })

            if (showGenericModalAction) {
                let { redirectTo, parentProps } = genericModalProps;

                showGenericModalAction({
                    redirectTo: redirectTo,
                    parentProps: parentProps,
                    err: err
                })
            }
        })
}

export const fetchAndHandleWarehouseProducts = (getWarehouseProductsAction, showGenericModalAction, genericModalProps) => {
    getWarehouseProducts()
        .then(res => {
            getWarehouseProductsAction({ success: true, data: res.data })
        })
        .catch(err => {
            getWarehouseProductsAction({ success: false, error: err })

            if (showGenericModalAction) {
                let { redirectTo, parentProps } = genericModalProps;

                showGenericModalAction({
                    redirectTo: redirectTo,
                    parentProps: parentProps,
                    err: err
                })
            }
        })
}