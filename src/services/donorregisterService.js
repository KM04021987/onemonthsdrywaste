require('dotenv').config();
import bcrypt from "bcryptjs";
const ibmdb = require('ibm_db');
let connStr = "DATABASE="+process.env.DB_DATABASE+";HOSTNAME="+process.env.DB_HOSTNAME+";PORT="+process.env.DB_PORT+";UID="+process.env.DB_UID+";PWD="+process.env.DB_PWD+";PROTOCOL=TCPIP;SECURITY=SSL";

let createNewUser = (data) => {
    console.log('donorregisterService: createNewUser')
    return new Promise(async (resolve, reject) => {
        // check phone number is exist or not
        let isPhoneExist = await checkExistPhone(data.phone);
        if (isPhoneExist) {
            reject(`This phone "${data.phone}" has already exist in our Donor's or Receiver's database. Please choose another phone number.`);
        } else {
            // hash password
            let salt = bcrypt.genSaltSync(10);
            let pass = bcrypt.hashSync(data.password, salt);
            //create a new account
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;            
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".donor_info (fullname, phone_no, country, state, city, pin_or_zip, address, password) values(?, ?, ?, ?, ?, ?, ?, ?);", [data.fullname, data.phone, data.country, data.state, data.city, data.pin, data.address,  pass], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Create a new donor user successful");
                })
            });
        }
    });
};

let checkExistPhone = (phone) => {
    console.log('donorregisterservice: checkExistPhone')
    return new Promise( (resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".donor_info where phone_no=? with ur", [phone], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    if (rows.length > 0) {
                        resolve(true)
                    } else {
                        conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".receiver_info where phone_no=? with ur", [phone], function(err, rows) {
                            if (err) {
                                reject(err)
                            }
                            if (rows.length > 0) {
                                resolve(true)
                            } else {
                                resolve(false)
                            }
                        })
                    }
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    createNewUser: createNewUser
};