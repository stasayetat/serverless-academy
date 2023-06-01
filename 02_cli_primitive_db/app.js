import inquirer from 'inquirer';
import {writeFile, readFile} from 'fs/promises';
import {resolve, dirname} from 'path';

const dbPath = resolve(dirname('.'), 'primitive_db.txt');
let currDBArr = [];
const promptName = {
        type: 'input',
        name: 'user',
        message: "Enter the user's name. Press ENTER to cansel: ",
};

const questions = [
    {
        type: 'list',
        name: 'gender',
        message: 'Enter your gender: ',
        choices: [
            'male',
            'female'
        ]
    },
    {
        type: 'input',
        name: 'age',
        message: 'Enter your age: ',
        validate(value) {
            if(Number(value))
                return true
            else
                return 'Please enter a number';
        },
    }
];

const dbQuestions = [
    {
        type: 'confirm',
        name: 'toBeFound',
        message: 'Would you search user in DB: '
    },
    {
        type: 'input',
        name: 'searchValue',
        message: "Type user's name you want to find in DB: ",
        async when(answers) {
            if(answers.toBeFound)
                currDBArr = await getDataFromDB();
            return answers.toBeFound;
        },
        validate(value) {
            if(value)
                return true
            else
                return 'Please enter a value';
        },
    }
];

async function getDataFromDB() {
    const res = await readFile(dbPath, 'utf8');
    console.log(JSON.parse(res));
    return JSON.parse(res);
}

function getDataByValue(value) {
    let user = currDBArr.find((item)=> {
       if(item.user.toUpperCase() === value.toUpperCase()) {
           return true;
       }
    });
    if(!user) {
        console.log('This value not exists!');
        process.exit();
    } else {
        console.log(`User ${value} has been found!`);
        console.log(user);
    }
}

async function setDateToDB(data) {
    const resRead = await readFile(dbPath, 'utf8');
    const usersArr = JSON.parse(resRead);
    usersArr.push(data);
    await writeFile(dbPath, JSON.stringify(usersArr));
}

(async function main() {
    let userName;
    await inquirer.prompt(promptName).then(async (answers)=> {
        if(answers.user === '') {
            await inquirer.prompt(dbQuestions).then(async(answers)=> {
                if(answers.toBeFound) {
                    getDataByValue(answers.searchValue);
                } else {
                    console.log('\nBye-bye. See you later');
                    process.exit();
                }
            });
        } else {
            userName = answers.user;
            await inquirer.prompt(questions).then(async (answers)=>{
                answers.user = userName;
                await setDateToDB(answers);
            });
            return main();
        }
    });
})();