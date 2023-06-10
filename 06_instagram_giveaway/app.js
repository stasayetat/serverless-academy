import {readdir, readFile} from 'fs/promises';
const resMap = new Map();
const start = performance.now();
await readFileWords();
console.log(`Unique usernames - ${uniqueValues()}`);
console.log(`Exist in at least ten - ${existInAtleastTen()}`);
console.log(`Exist in all files - ${existInAllFiles()}`);
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);

async function readFileWords() {
    const fileNames = await readdir('./words');
    const promiseFileNames = fileNames.map((item) => readFile(`./words/${item}`, {encoding: 'utf8'}));
    await Promise.all(promiseFileNames)
        .then((responses => {
            responses.forEach((response, index) => {
                const tmpChunk = response.split('\n');
                const qweSet = new Set(tmpChunk);
                for (let el of qweSet) {
                    if (resMap.has(el)) {
                        resMap.set(el, resMap.get(el) + 1);
                    } else {
                        resMap.set(el, 1);
                    }
                }
            });
        }));
}

function uniqueValues() {
    return resMap.size;
}

function existInAllFiles() {
    let allFilesUsernames = 0;
    resMap.forEach((value, key, map)=> {
        if(value === 20) {
            allFilesUsernames++;
        }
    });
    return allFilesUsernames;
}

function existInAtleastTen() {
    let atLeastTenUsernames = 0;
    resMap.forEach((value, key, map)=> {
        if(value >= 10) {
            atLeastTenUsernames++;
        }
    });
    return atLeastTenUsernames;
}