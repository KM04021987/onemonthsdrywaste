require('dotenv').config();
const ibmdb = require('ibm_db');
let connStr = "DATABASE="+process.env.DB_DATABASE+";HOSTNAME="+process.env.DB_HOSTNAME+";PORT="+process.env.DB_PORT+";UID="+process.env.DB_UID+";PWD="+process.env.DB_PWD+";PROTOCOL=TCPIP;SECURITY=SSL";

let createPickupRequest = (data) => {
    console.log('pickuprequestService: createPickupRequest')
    return new Promise(async (resolve, reject) => {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".pickup_request(DONOR_ACCOUNT, PLASTIC_BOTTLE, PLASTIC_WRAPPER, GLASS_BOTTLE, METAL_CANS, PAPER_WASTE, OTHER_WASTE, DONOR_COUNTRY, DONOR_STATE, DONOR_CITY, DONOR_PIN_OR_ZIP, DONOR_ADDRESS, DONOR_PHONE_NO) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.donoraccount, data.plasticbottle, data.plastcwrapper, data.glassbottle, data.metalcans, data.paperbox, data.others, data.country, data.state, data.city, data.pin, data.address, data.phone], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Successfully Created a new pickup request");
                })
            });
    });
};

let getPickupRequestNumber = (donoraccount) => {
    console.log('pickuprequestService: getPickupRequestNumber')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".pickup_request WHERE donor_account=? ORDER BY PICKUP_REQUEST_NO DESC fetch first 1 row only with ur;", [donoraccount], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let data = rows;
                    resolve(data);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let extractPickupRequest = (donoraccount) => {
    console.log('pickuprequestService: extractPickupRequest')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".pickup_request WHERE donor_account=? ORDER BY PICKUP_REQUEST_NO DESC with ur;", [donoraccount], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    let data = rows;
                    resolve(data);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let getPickupForEditPage = (pickuprequestno) => {
    console.log('pickuprequestService: getPickupForEditPage')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".pickup_request WHERE pickup_request_no=? with ur;", [pickuprequestno], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    let pickup = rows;
                    resolve(pickup);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let updatePickupInfo = (data) => {
    console.log('pickuprequestService: updatePickupInfo')
    return new Promise(async (resolve, reject) => {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("UPDATE "+process.env.DB_SCHEMA+".pickup_request SET DONOR_ACCOUNT = ?, PLASTIC_BOTTLE = ?, PLASTIC_WRAPPER= ?, GLASS_BOTTLE= ?, METAL_CANS= ?, PAPER_WASTE= ?, OTHER_WASTE= ?, DONOR_COUNTRY= ?, DONOR_STATE= ?, DONOR_CITY= ?, DONOR_PIN_OR_ZIP= ?, DONOR_ADDRESS= ?, DONOR_PHONE_NO= ? where pickup_request_no = ?;", [data.donoraccount, data.plasticbottle, data.plastcwrapper, data.glassbottle, data.metalcans, data.paperbox, data.others, data.country, data.state, data.city, data.pin, data.address, data.phone, data.requestno], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(false)
                    }
                    resolve("Successfully updated pickup request");
                })
            });
    });
};

let deletePickupById = (id) => {
    console.log('pickuprequestService: deletePickupById')
    return new Promise(async (resolve, reject) => {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("DELETE FROM "+process.env.DB_SCHEMA+".pickup_request where pickup_request_no=?;", [id], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(false)
                    }
                    resolve("Successfully deleted pickup request");
                })
            });
    });
};

let getReceiverList = (findByInfo) => {
    console.log('pickuprequestService: getReceiverList')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".receiver_info WHERE Country = ? and state = ? and PIN_OR_ZIP = ?  with ur;", [findByInfo.country, findByInfo.state, findByInfo.pin], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    let data = rows;
                    resolve(data);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let getPickupList = (RECEIVER_COUNTRY, RECEIVER_STATE, RECEIVER_PIN_OR_ZIP) => {
    console.log('pickuprequestService: getPickupList')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".pickup_request WHERE donor_Country = ? and donor_state = ? and donor_PIN_OR_ZIP = ?  ORDER BY ADD_TS DESC with ur;", [RECEIVER_COUNTRY, RECEIVER_STATE, RECEIVER_PIN_OR_ZIP], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    let data = rows;
                    resolve(data);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let saveReceiversMessage = (donoraccount, receiveraccount, messageContent) => {
    console.log('pickuprequestService: saveReceiversMessage')
    return new Promise(async (resolve, reject) => {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".MESSAGE_INFO(DONOR_ACCOUNT, RECEIVER_ACCOUNT, RECEIVERS_MESSAGE) values(?, ?, ?);", [donoraccount, receiveraccount, messageContent], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(false)
                    }
                    resolve("Successfully Created a new pickup request");
                })
            });
    });
};


let getDonorList = (findByInfo) => {
    console.log('pickuprequestService: getDonorList')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".donor_info WHERE Country = ? and state = ? and PIN_OR_ZIP = ?  with ur;", [findByInfo.country, findByInfo.state, findByInfo.pin], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    let data = rows;
                    resolve(data);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    createPickupRequest: createPickupRequest,
    getPickupRequestNumber: getPickupRequestNumber,
    extractPickupRequest: extractPickupRequest,
    getPickupForEditPage: getPickupForEditPage,
    updatePickupInfo: updatePickupInfo,
    deletePickupById: deletePickupById,
    getReceiverList: getReceiverList,
    getPickupList: getPickupList,
    saveReceiversMessage: saveReceiversMessage,
    getDonorList: getDonorList
};