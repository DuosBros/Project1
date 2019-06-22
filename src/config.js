export default {
    "url":
    {
        "api":
        {
            "local": "http://localhost:3000/rest/",
            "dev": "https://medpharmavn-test.herokuapp.com/rest/",
            "prod": "https://medpharmavn.herokuapp.com/rest/"
        }
    },
    "styles": {
        "warningColor": "#f7ead89c",
        "successColor": "#32ba4530",
        "errorColor": "#f2005614",
        "notActiveColor": "#bfbfbf"
    },
    "config":
    {
        "localStorageName": "showBubsAndVagena",
        "defaultSmartformLimit": 10,
        "ordersPerPageAndRequestLimit": 100,
        "deliveryCompanies": ["GLS", "CP", "None"],
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
                    "id": 50470
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
    },
    "suppliers": [
        {
            "email": "hlasenska@medpharma.cz",
            "category": "Medpharma"
        },
        {
            "email": "obchody.milota@seznam.cz",
            "category": "Milota"
        }
    ],
    "contactTypes": [
        {
            "key": 0,
            "icon": "ban",
            "text": "empty"
        },
        {
            "key": 1,
            "icon": "phone",
            "text": "phone call & SMS"
        },
        {
            "key": 2,
            "icon": "facebook",
            "text": "facebook"
        },
        {
            "key": 3,
            "icon": "viber",
            "text": "viber"
        },
        {
            "key": 4,
            "image": "zalo.png",
            "text": "zalo"
        },
        {
            "key": 5,
            "icon": "discussions",
            "text": "face to face talk"
        }
    ]
}