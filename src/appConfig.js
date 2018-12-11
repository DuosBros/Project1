// export const MEDPHARMAVN_API = "https://medpharmavn.herokuapp.com/rest/"
export const MEDPHARMAVN_API = "http://localhost:3000/rest/"

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

export const paymentTypes = [
    { type: "vs" },
    { type: "cash" }
]

// $files = gci "C:\Users\atran1\Desktop\work\MedpharmaOrdersV2\src" -Recurse -File | ?{$_.Fullname -notlike "*assets*"};$b = 0;foreach($file in $files){$a = Get-content $file.Fullname;$b = $b + $a.length;};$b

// 14.11. 1627
// 24.11. 2040
// 27.11. 2451