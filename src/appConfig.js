// export const MEDPHARMAVN_API = "https://medpharmavn.herokuapp.com/rest/"
export const MEDPHARMAVN_API = "http://localhost:3000/rest/"
export const SMARTFORM_API = "http://smartform.cz/smartform-ws/oracle/v4"

export const SMARTFORM_KEY = "KQVrc9iW"
export const DEFAULT_SMARTFORM_LIMIT = 10

export const LOCALSTORAGE_NAME = 'showBubsAndVagena'

export const GET_ORDERS_LIMIT = 100

export const warningColor = '#f7ead89c'
export const successColor = '#f5fbe7'
export const errorColor = '#f2005614'
export const notActiveColor = '#bfbfbf'

export const deliveryCompanies = [
    { company: "gls" },
    { company: "cp" }
]

export const deliveryTypes = [
    { type: "vs" },
    { type: "cash" }
]

export const DEFAULT_ORDER_LOCK_SECONDS = 10

// $files = gci "C:\Users\atran1\Desktop\work\MedpharmaOrdersV2\src" -Recurse -File | ?{$_.Fullname -notlike "*assets*"};$b = 0;foreach($file in $files){$a = Get-content $file.Fullname;$b = $b + $a.length;};$b

// 14.11. 1627
// 24.11. 2040
// 27.11. 2451
// 16.12. 3281
// 27.12. 3892


// zbarvit backgorund red když product neni už ve WH
