import config from './config';

export const MEDPHARMAVN_API = process.env.NODE_ENV === 'development' ? config.url.api.local : config.url.api.prod
export const DEFAULT_SMARTFORM_LIMIT = config.config.defaultSmartformLimit

export const LOCALSTORAGE_NAME = config.config.localStorageName

export const GET_ORDERS_LIMIT = config.config.ordersPerPageAndRequestLimit

export const warningColor = config.styles.warningColor
export const successColor = config.styles.successColor
export const errorColor = config.styles.errorColor
export const notActiveColor = config.styles.notActiveColor

export const deliveryCompanies = config.config.deliveryCompanies

export const deliveryTypes = config.config.deliveryTypes

export const DEFAULT_ORDER_LOCK_SECONDS = config.config.defaultLockSeconds

export const APP_TITLE = config.config.appTitle

export const ORDER_DELIVERY_JSON = config.zaslatDeliveryJson

// $files = gci "C:\Users\atran1\Desktop\work\MedpharmaOrdersV2\src" -Recurse -File | ?{$_.Fullname -notlike "*assets*"};$b = 0;foreach($file in $files){$a = Get-content $file.Fullname;$b = $b + $a.length;};$b | clip.exe

// 14.11. 1627
// 24.11. 2040
// 27.11. 2451
// 16.12. 3281
// 27.12. 3892
// 04.02. 4453
// 18.02. 4454
// 04.03  3809
// 12.03  4769
// 22.03  6384
// 25.03  6551
// 10.04  7132
// 11.04  7240
// 17.04  7734
// 22.04  7783
