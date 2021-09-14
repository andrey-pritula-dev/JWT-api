const dotenv = require('dotenv');
dotenv.config();
const readline = require('readline');
const {registerUser, loginUser, logoutUser, userSessions} = require("./controllers/userController");
require("./mongoose").connect();
let userData = {};
const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(questionText) {
    return new Promise((resolve, reject) => {
        readlineInterface.question(questionText, (input) => resolve(input));
    });
}

start()

async function start() {
    let action = await ask("What do you want (register/login/logout/sessions) > ");
    if (action) {
        switch (action.trim()) {
            case "register":
                if (userData['email']?.length || userData['password']?.length) {
                    console.log('You already logged in, please log out then register new user');
                    await start();
                }
                userData['email'] = await ask("Please enter email > ");
                userData['password'] = await ask("Please enter password > ");
                if (!userData['email'] || !userData['password']) {
                    userData['email'] = "";
                    userData['password'] = "";
                    console.log('Invalid input data');
                    await start();
                }
                const registerResult = await registerUser(userData);
                if (!registerResult.success) {
                    userData['email'] = "";
                    userData['password'] = "";
                    console.log(registerResult.message)
                    await start();
                } else {
                    userData = {};
                    console.log(registerResult.message)
                }
                break;
            case "login":
                if (userData['email']?.length || userData['password']?.length) {
                    console.log('You already logged in');
                    await start();
                }
                userData['email'] = await ask("Please enter email > ");
                userData['password'] = await ask("Please enter password > ");
                if (!userData['email'] || !userData['password']) {
                    userData['email'] = "";
                    userData['password'] = "";
                    console.log('Invalid input data');
                    await start();
                }
                const loginResult = await loginUser(userData);
                if (loginResult.success) {
                    userData['token'] = loginResult.token;
                } else {
                    console.log(loginResult.message)
                }
                break;
            case "logout":
                if (Object.keys(userData).length === 0) {
                    console.log('You can\'t log out if you not logged in');
                    await start();
                }
                let logOut = await ask("Are you sure > Y/n > ");
                if (logOut.toLowerCase() === 'y') {
                    await logoutUser(userData);
                    userData = {};
                    await start();
                }
                break;
            case "sessions":
                const result = await userSessions(userData);
                console.log(result)
                break;
            default:
                console.log(`Invalid command > ${action}`);
                await start();
                break;
        }
        await start();
    } else {
        console.log(`Invalid command > ${action}`);
        await start();
    }
}

