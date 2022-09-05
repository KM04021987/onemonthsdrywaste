require('dotenv').config();
import bcrypt from "bcryptjs";
const ibmdb = require('ibm_db');
let connStr = "DATABASE="+process.env.DB_DATABASE+";HOSTNAME="+process.env.DB_HOSTNAME+";PORT="+process.env.DB_PORT+";UID="+process.env.DB_UID+";PWD="+process.env.DB_PWD+";PROTOCOL=TCPIP;SECURITY=SSL";
let nodeGeocoder = require('node-geocoder');

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
            let options = {
                provider: 'openstreetmap'
            };
            let geoCoder = nodeGeocoder(options);

            let fulladdress = data.state;
            fulladdress += ', ';
            fulladdress += data.country;
            fulladdress += ', ';
            fulladdress += data.pin;

            geoCoder.geocode(fulladdress).then((res)=> {
                let row = res[0];
                const jsonData = JSON.stringify(row)
                const removebracket1 = jsonData.replace('[','')
                const removebracket2 = removebracket1.replace(']','')
                const jsonParseobj = JSON.parse(removebracket2)
                const dlatitude = jsonParseobj.latitude
                const dlongitude = jsonParseobj.longitude
                const dcountry = jsonParseobj.country
                const dstate = jsonParseobj.state
                const dpin = jsonParseobj.zipcode


            //create a new account
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err; 
                if(dcountry === data.country && dstate === data.state && dpin === data.pin)  {        
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".donor_info (fullname, phone_no, country, state, city, pin_or_zip, address, latitude, longitude, password) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.fullname, data.phone, data.country, data.state, data.city, data.pin, data.address, dlatitude, dlongitude, pass], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Create a new donor user successful");
                })
                } else {
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".donor_info (fullname, phone_no, country, state, city, pin_or_zip, address, password) values(?, ?, ?, ?, ?, ?, ?, ?);", [data.fullname, data.phone, data.country, data.state, data.city, data.pin, data.address, pass], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Create a new donor user successful");
                })
                }
            });
        })
        .catch((err)=> {
            console.log(err);
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

let updateDonorProfile = (data) => {
    console.log('donorregisterService: updateDonorProfile')
    return new Promise(async (resolve, reject) => {  
    // check phone number is exist or not
        ibmdb.open(connStr, function (err, conn) {
            if (err) throw err;
            conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".donor_info where phone_no=? and account <> ? with ur", [data.phone, data.donoraccount], function(err, rows) {
                if (err) {
                    reject(err)
                }
                if (rows.length > 0) {
                    reject(`This phone "${data.phone}" has already exist in Donor's database. Please choose another phone number. `);
                } else {
                    ibmdb.open(connStr, function (err, conn) {
                        if (err) throw err;
                        conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".receiver_info where phone_no=? with ur", [data.phone], function(err, rows) {
                            if (err) {
                                reject(err)
                            }
                            if (rows.length > 0) {
                                reject(`This phone "${data.phone}" has already exist in our Receiver's database. Please choose another phone number. `);
                            } else {
                                //update the account
                                ibmdb.open(connStr, function (err, conn) {
                                    if (err) throw err;           
                                    conn.query("UPDATE "+process.env.DB_SCHEMA+".donor_info SET phone_no = ?, country = ?, state = ?, city = ?, pin_or_zip = ?, address = ? where account = ?;", [data.phone, data.country, data.state, data.city, data.pin, data.address, data.donoraccount], function(err, rows) {
                                        if (err) {
                                            reject(false)
                                        }
                                        resolve("Updating donor profile is successful");
                                    })
                                })
                            }
                        })
                    })
                }
            })
        })
    })
};

let updateDonorPassword = (data) => {
    console.log('donorregisterService: updateDonorPassword')
    return new Promise(async (resolve, reject) => {
        if (data.newpassword == data.passwordConfirmation)  {
            await bcrypt.compare(data.oldpassword, data.savedPassword).then((isMatch) => {
                if (isMatch) {
                    let salt = bcrypt.genSaltSync(10);
                    let pass = bcrypt.hashSync(data.newpassword, salt);
                    //update the account
                    ibmdb.open(connStr, function (err, conn) {
                        if (err) throw err;           
                        conn.query("UPDATE "+process.env.DB_SCHEMA+".donor_info SET password = ? where account = ?;", [pass, data.donoraccount], function(err, rows) {
                            if (err) {
                                reject(false)
                            }
                            resolve("Updating donor user is successful");
                        })
                    })
                }
                else {
                    reject(`The password that you typed as "Old Password" is not matching with your existing password. `);
                }
            })
        } 
        else {
            reject(`New Password and Password Confirmation are not matching. `);      
        }
    })
};

let deleteProfile = (id) => {
    console.log('donorregisterService: deleteProfile')
    return new Promise(async (resolve, reject) => {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("DELETE FROM "+process.env.DB_SCHEMA+".donor_info where account=?;", [id], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Successfully deleted pickup request");
                })
            });
    });
};

module.exports = {
    createNewUser: createNewUser,
    updateDonorProfile: updateDonorProfile,
    updateDonorPassword: updateDonorPassword,
    deleteProfile: deleteProfile
};