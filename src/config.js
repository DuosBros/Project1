export default {
    "url":
    {
        "api":
        {
            "local": "http://localhost:3000/rest/",
            "dev": "http://medpharmavn-test.herokuapp.com/rest/",
            "prod": "https://medpharmavn.herokuapp.com/rest/"
        }
    },
    "styles": {
        "warningColor": "#f7ead89c",
        "successColor": "#f5fbe7",
        "errorColor": "#f2005614",
        "notActiveColor": "#bfbfbf"
    },
    "config":
    {
        "localStorageName": "showBubsAndVagena",
        "defaultSmartformLimit": 10,
        "ordersPerPageAndRequestLimit": 100,
        "deliveryCompanies": ["GLS", "CP"],
        "deliveryTypes": ["VS", "CASH"],
        "defaultLockSeconds": 10,
        "appTitle": "MedpharmaVN - "
    },
    "zaslatDeliveryJson": {
        "currency": "CZK",
        "payment_type": "invoice",
        "shipments": [
            {
                "type": "ONDEMAND",
                "carrier": "GLS",
                "reference": null,
                "pickup_branch": "1",
                "from": {
                    "id": 8
                },
                "to": {
                    "firstname": null,
                    "surname": null,
                    "street": null,
                    "city": null,
                    "zip": null,
                    "country": "CZ",
                    "phone": null,
                    "company": null
                },
                "services": [
                    {
                        "code": "ins",
                        "data": {
                            "currency": "CZK",
                            "value": 6000
                        }
                    },
                    {
                        "code": "cod",
                        "data": {
                            "bank_account": "2401089228",
                            "bank_code": "2010",
                            "bank_variable": null,
                            "value": {
                                "currency": "CZK",
                                "value": null
                            }
                        }
                    }
                ],
                "packages": [
                    {
                        "weight": null,
                        "width": null,
                        "height": null,
                        "length": null
                    }
                ]
            }
        ]
    }
}