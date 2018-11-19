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

export const filterInArrayOfObjects = (toSearch, array, tempResult) => {
    // var results = [];
    toSearch = trimString(toSearch); // trim it
    for (var i = 0; i < array.length; i++) {
        Object.keys(array[i]).map((key, index) => {
            if (typeof array[i][key] === 'object') {
                filterInArrayOfObjects(toSearch, array[i][key], tempResult)
            }
            else { // fuken lodash returning isEmpty true for numbers
                if (array[i][key].toString().toLowerCase().indexOf(toSearch.toString().toLowerCase()) !== -1) {
                    if (!itemExists(tempResult, array[i])) tempResult.push(array[i]);
                }
            }
        })
    }
    console.log(tempResult)
    return tempResult;
}

export const debounce = (fn, time) => {
    let timeout;

    return function () {
        const functionCall = () => fn.apply(this, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}