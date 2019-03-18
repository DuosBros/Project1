export const MEDPHARMAVN_API = "https://medpharmavn-test.herokuapp.com/rest/"
export const DEFAULT_SMARTFORM_LIMIT = 10

export const LOCALSTORAGE_NAME = 'showBubsAndVagena'

export const GET_ORDERS_LIMIT = 100

export const warningColor = '#f7ead89c'
export const successColor = '#f5fbe7'
export const errorColor = '#f2005614'
export const notActiveColor = '#bfbfbf'

export const deliveryCompanies = [
    { company: "GLS" },
    { company: "CP" }
]

export const deliveryTypes = [
    { type: "VS" },
    { type: "CASH" }
]

export const DEFAULT_ORDER_LOCK_SECONDS = 10

export const APP_TITLE = "MedpharmaVN - "

export const ORDER_DELIVERY_JSON = {
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

// $files = gci "C:\Users\atran1\Desktop\work\MedpharmaOrdersV2\src" -Recurse -File | ?{$_.Fullname -notlike "*assets*"};$b = 0;foreach($file in $files){$a = Get-content $file.Fullname;$b = $b + $a.length;};$b

// 14.11. 1627
// 24.11. 2040
// 27.11. 2451
// 16.12. 3281
// 27.12. 3892
// 04.02. 4453
// 18.02. 4454
// 04.03  3809
// 12.03  4769
