require('dotenv').config();
const ibmdb = require('ibm_db');
let connStr = "DATABASE="+process.env.DB_DATABASE+";HOSTNAME="+process.env.DB_HOSTNAME+";PORT="+process.env.DB_PORT+";UID="+process.env.DB_UID+";PWD="+process.env.DB_PWD+";PROTOCOL=TCPIP;SECURITY=SSL";

let saveDonorsMessage = (donoraccount, receiveraccount, messageContent) => {
    console.log('pickuprequestService: saveDonorsMessage')
    return new Promise(async (resolve, reject) => {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".MESSAGE_INFO(DONOR_ACCOUNT, RECEIVER_ACCOUNT, DONORS_MESSAGE) values(?, ?, ?);", [donoraccount, receiveraccount, messageContent], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(false)
                    }
                    resolve("Successfully Created a new pickup request");
                })
            });
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

let getChatListOfDonor = (donoraccount) => {
    console.log('pickuprequestService: getChatListOfDonor')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT DISTINCT(A.RECEIVER_ACCOUNT), B.FULLNAME FROM "+process.env.DB_SCHEMA+".message_info A INNER JOIN "+process.env.DB_SCHEMA+".RECEIVER_INFO B ON A.RECEIVER_ACCOUNT = B.ACCOUNT WHERE A.DONOR_ACCOUNT = ? with ur;", [donoraccount], function(err, rows) {
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


let getDonorChatHistory = (donoraccount, receiveraccount) => {
    console.log('pickuprequestService: getDonorChatHistory')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".message_info WHERE MESSAGE_ID IN(SELECT MESSAGE_ID FROM "+process.env.DB_SCHEMA+".message_info WHERE DONOR_ACCOUNT = ? AND RECEIVER_ACCOUNT = ? ORDER BY ADD_TS DESC FETCH FIRST 10 ROWS ONLY) ORDER BY MESSAGE_ID ASC with ur;", [donoraccount, receiveraccount], function(err, rows) {
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


let getChatListOfReceiver = (receiveraccount) => {
    console.log('pickuprequestService: getChatListOfReceiver')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT DISTINCT(A.DONOR_ACCOUNT), B.FULLNAME FROM "+process.env.DB_SCHEMA+".message_info A INNER JOIN "+process.env.DB_SCHEMA+".DONOR_INFO B ON A.DONOR_ACCOUNT = B.ACCOUNT WHERE A.RECEIVER_ACCOUNT = ? with ur;", [receiveraccount], function(err, rows) {
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

let getReceiverChatHistory = (donoraccount, receiveraccount) => {
    console.log('pickuprequestService: getReceiverChatHistory')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".message_info WHERE MESSAGE_ID IN(SELECT MESSAGE_ID FROM "+process.env.DB_SCHEMA+".message_info WHERE DONOR_ACCOUNT = ? AND RECEIVER_ACCOUNT = ? ORDER BY ADD_TS DESC FETCH FIRST 10 ROWS ONLY) ORDER BY MESSAGE_ID ASC with ur;", [donoraccount, receiveraccount], function(err, rows) {
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
    saveDonorsMessage: saveDonorsMessage,
    saveReceiversMessage: saveReceiversMessage,
    getChatListOfDonor: getChatListOfDonor,
    getDonorChatHistory: getDonorChatHistory,
    getChatListOfReceiver: getChatListOfReceiver,
    getReceiverChatHistory: getReceiverChatHistory
};