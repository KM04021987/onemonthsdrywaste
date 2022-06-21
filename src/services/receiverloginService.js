require('dotenv').config();
import bcrypt from "bcryptjs";
const ibmdb = require('ibm_db');
let connStr = "DATABASE="+process.env.DB_DATABASE+";HOSTNAME="+process.env.DB_HOSTNAME+";PORT="+process.env.DB_PORT+";UID="+process.env.DB_UID+";PWD="+process.env.DB_PWD+";PROTOCOL=TCPIP;SECURITY=SSL";

let handleLogin = (phone, password) => {
    console.log('receiverloginService: handleLogin')
    return new Promise(async (resolve, reject) => {
        //check phone number is exist or not
        let user = await findUserByPhone(phone);
        if (user) {
            //compare password
            await bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    reject(`The password that you've entered is incorrect`);
                }
            });
        } else {
            reject(`This user phone "${phone}" doesn't exist`);
        }
    });
};

let findUserByPhone = (phone) => {
    console.log('receiverloginService: findUserByPhone')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".receiver_info WHERE phone_no=? with ur;", [phone], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let findUserByAccount = (account) => {
    console.log('receiverloginService: findUserByAccount')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".receiver_info WHERE account=? with ur;", [account], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let comparePassword = (password, user) => {
    console.log('receiverloginService: comparePassword')
    return new Promise(async (resolve, reject) => {
        try {
            const jsonData = JSON.stringify(user)
            const jsonDataObj = JSON.parse(jsonData)
            const jsonPaswordNospace = jsonDataObj.PASSWORD.replace(/\s/g, '')
            await bcrypt.compare(password, jsonPaswordNospace).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    resolve(`The password that you've entered is incorrect`);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleLogin: handleLogin,
    findUserByPhone: findUserByPhone,
    findUserByAccount: findUserByAccount,
    comparePassword: comparePassword
};