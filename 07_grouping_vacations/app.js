import {readFile, writeFile} from 'fs/promises';

const vacationsText = await readFile('vacations.json', 'utf8');
const vacationsJSON = JSON.parse(vacationsText);
const usersVacation = [];
vacationsJSON.forEach((item)=> {
    const checkUser = findUserInUsersVacation(item.user._id);
    if(checkUser === undefined) {
        usersVacation.push({
            userId: item.user._id,
            userName: item.user.name,
            vacations: [{
                startDate: item.startDate,
                endDate: item.endDate
            }]
        });
    } else {
        checkUser.vacations.push({
            startDate: item.startDate,
            endDate: item.endDate
        });
    }
});

usersVacation.forEach((item)=> {
    console.log(item);
});

await writeFile('transformed_vacations.json', JSON.stringify(usersVacation), 'utf8');
function findUserInUsersVacation(userId) {
    const findUser =  usersVacation.find((item)=> {
        if(item.userId === userId) {
            return true;
        }
    });
    return findUser;
}