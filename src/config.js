export default {
    "url":
    {
        "api":
        {
            "local": "http://localhost:3000/rest/",
            "dev": "",
            "prod": ""
        }
    },
    "styles": {
        "warningColor": "#f2711c26",
        "successColor": "#32ba4530",
        "errorColor": "#f2005645",
        "notActiveColor": "#bfbfbf"
    },
    "config":
    {
        "localStorageName": "",
        "defaultSmartformLimit": 10,
        "ordersPerPageAndRequestLimit": 100,
        "deliveryCompanies": ["A", "B", "None"],
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
                "carrier": "A",
                "reference": null,
                "pickup_branch": "1",
                "from": {
                    "id": 0
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
                            "value": 0
                        }
                    },
                    {
                        "code": "cod",
                        "data": {
                            "bank_account": "",
                            "bank_code": "",
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
                ],
                "note": null
            }
        ]
    },
    "suppliers": [
        {
            "email": "a@a.a",
            "category": "a"
        },
        {
            "email": "b.b@b.cz",
            "category": "b"
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
            "corner": "comment",
            "text": "facebook & comment"
        },
        {
            "key": 3,
            "icon": "facebook",
            "corner": "inbox",
            "text": "facebook & inbox"
        },
        {
            "key": 4,
            "icon": "viber",
            "text": "viber"
        },
        {
            "key": 5,
            "image": "zalo.png",
            "text": "zalo"
        },
        {
            "key": 6,
            "icon": "discussions",
            "text": "face to face talk"
        }
    ]
}