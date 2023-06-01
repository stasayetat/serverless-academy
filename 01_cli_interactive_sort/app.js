import { createInterface } from 'readline';
import { promisify } from 'util';
console.log('');
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});
const question = promisify(rl.question).bind(rl);
const sortMap = new Map();
setValueForSortMap();

while(true) {
    const answer = await question("\n\nEnter a few words or numbers separated by spaces: ");
    const allSymbols = answer.split(' ');
    printSortType();
    const sortType = await getSortType();
    console.log('You choose - ' + sortType);
    sortMap.get(sortType)(allSymbols);
}

function printSortType() {
    console.log('\nChoose a sort type');
    console.log('1. Words alphabetically');
    console.log('2. Numbers from lesser to greater');
    console.log('3. Numbers from bigger to smaller');
    console.log('4. Words by their length in ascending');
    console.log('5. Only unique words');
    console.log('6. Only unique values');
}

async function getSortType() {
    while(true) {
        const answerSortType = await question("\nEnter [1-6]: ");
        if(answerSortType === 'exit') {
            console.log('\nBye-bye. See you later!');
            process.exit();
        }
        const numSortType = Number(answerSortType)
        if(numSortType < 1 || numSortType > 6 || !numSortType) {
            console.log('You enter a wrong value, try again');
        } else {
            return Number(answerSortType);
        }
    }
}

function setValueForSortMap() {
    sortMap.set(1, (args)=> {
        const allWords = args.filter((item)=> {
            if(!Number(item) && item !== '0') {
                return true;
            }
        });
        allWords.sort();
        console.log(allWords);
    });

    sortMap.set(2, (args)=> {
        const allNums = args.filter((item)=> {
            if(Number(item) || item === '0') {
                return true;
            }
        });
        allNums.sort((a, b)=> a - b);
        console.log(allNums);
    });

    sortMap.set(3, (args)=> {
        const allNums = args.filter((item)=> {
            if(Number(item) || item === '0') {
                return true;
            }
        });
        allNums.sort((a, b)=> b - a);
        console.log(allNums);
    });

    sortMap.set(4, (args)=> {
        const allWords = args.filter((item)=> {
            if(!Number(item) && item !== '0') {
                return true;
            }
        });
        allWords.sort((a, b)=> {
            if(a.length > b.length)
                return 1;
            if(a.length < b.length)
                return -1;
            return 0;
        });
        console.log(allWords);
    });

    sortMap.set(5, (args)=> {
        const allWords = args.filter((item)=> {
            if(!Number(item) && item !== '0') {
                return true;
            }
        });
        const wordSet = Array.from(new Set(allWords));
        console.log(wordSet);
    });

    sortMap.set(6, (args)=> {
        const wordSet = Array.from(new Set(args));
        console.log(wordSet);
    });
}
