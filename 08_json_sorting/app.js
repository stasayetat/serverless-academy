const requestArr = [
    'https://jsonbase.com/sls-team/json-793',
    'https://jsonbase.com/sls-team/json-955',
    'https://jsonbase.com/sls-team/json-231',
    'https://jsonbase.com/sls-team/json-931',
    'https://jsonbase.com/sls-team/json-93',
    'https://jsonbase.com/sls-team/json-342',
    'https://jsonbase.com/sls-team/json-770',
    'https://jsonbase.com/sls-team/json-491',
    'https://jsonbase.com/sls-team/json-281',
    'https://jsonbase.com/sls-team/json-718',
    'https://jsonbase.com/sls-team/json-310',
    'https://jsonbase.com/sls-team/json-806',
    'https://jsonbase.com/sls-team/json-469',
    'https://jsonbase.com/sls-team/json-258',
    'https://jsonbase.com/sls-team/json-516',
    'https://jsonbase.com/sls-team/json-79',
    'https://jsonbase.com/sls-team/json-706',
    'https://jsonbase.com/sls-team/json-521',
    'https://jsonbase.com/sls-team/json-350',
    'https://jsonbase.com/sls-team/json-64',
];

let countTrue = 0;
let countFalse = 0;
await fetchRequests();
console.log('Count true is ' + countTrue);
console.log('Count false is ' + countFalse);

async function fetchRequests() {
    for (const item of requestArr) {
        if(await checkFail(item)) {
            for(let i = 0; i < 3; i++) {
                if(await checkFail(item)) {
                    continue
                } else {
                    break
                }
            }
            console.log(`[Fail] ${item}: The endpoint is unavailable`);
        }
    }
}

async function checkFail(item) {
    let response = await fetch(item);
    if(response.ok) {
        let text = await response.json();
        const isDone = findPropertyIsDone(text);
        console.log(`[Success] ${item}: isDone - ${isDone}`);
        if(isDone) {
            countTrue++;
        } else {
            countFalse++;
        }
        return false;
    } else {
        return true;
    }
}

function findPropertyIsDone(obj) {
    if(obj.isDone !== undefined) {
        return obj.isDone
    }
    const objectPropertyNames = Object.getOwnPropertyNames(obj);
    for(let el of objectPropertyNames) {
        if(obj[el] instanceof Object && !Array.isArray(obj[el])) {
            const res = findPropertyIsDone(obj[el]);
            if(typeof res === 'boolean') {
                return res;
            }
        }
    }
    return null;
}