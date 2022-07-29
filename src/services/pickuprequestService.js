require('dotenv').config();
const ibmdb = require('ibm_db');
let connStr = "DATABASE="+process.env.DB_DATABASE+";HOSTNAME="+process.env.DB_HOSTNAME+";PORT="+process.env.DB_PORT+";UID="+process.env.DB_UID+";PWD="+process.env.DB_PWD+";PROTOCOL=TCPIP;SECURITY=SSL";

let createPickupRequestWithFile = (data, img) => {
    console.log('pickuprequestService: createPickupRequestWithFile')
    return new Promise(async (resolve, reject) => {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".pickup_request(DONOR_ACCOUNT, PLASTIC_BOTTLE, PLASTIC_WRAPPER, GLASS_BOTTLE, METAL_CANS, PAPER_WASTE, OTHER_WASTE, DONOR_COUNTRY, DONOR_STATE, DONOR_CITY, DONOR_PIN_OR_ZIP, DONOR_ADDRESS, DONOR_PHONE_NO, DRYWASTE_IMAGE) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.donoraccount, data.plasticbottle, data.plastcwrapper, data.glassbottle, data.metalcans, data.paperbox, data.others, data.country, data.state, data.city, data.pin, data.address, data.phone, img], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Successfully Created a new pickup request(With File)");
                })
            });
    });
};

let createPickupRequestWithoutFile = (data) => {
    console.log('pickuprequestService: createPickupRequestWithoutFile')
    return new Promise(async (resolve, reject) => {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".pickup_request(DONOR_ACCOUNT, PLASTIC_BOTTLE, PLASTIC_WRAPPER, GLASS_BOTTLE, METAL_CANS, PAPER_WASTE, OTHER_WASTE, DONOR_COUNTRY, DONOR_STATE, DONOR_CITY, DONOR_PIN_OR_ZIP, DONOR_ADDRESS, DONOR_PHONE_NO) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.donoraccount, data.plasticbottle, data.plastcwrapper, data.glassbottle, data.metalcans, data.paperbox, data.others, data.country, data.state, data.city, data.pin, data.address, data.phone], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Successfully Created a new pickup request(Without File)");
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
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".pickup_request WHERE donor_account=? ORDER BY LAST_UPDATED_TS DESC with ur;", [donoraccount], function(err, rows) {
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

let updatePickupInfoWithFile = (data, img) => {
    console.log('pickuprequestService: updatePickupInfoWithFile')
    return new Promise(async (resolve, reject) => {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("UPDATE "+process.env.DB_SCHEMA+".pickup_request SET DONOR_ACCOUNT = ?, PLASTIC_BOTTLE = ?, PLASTIC_WRAPPER= ?, GLASS_BOTTLE= ?, METAL_CANS= ?, PAPER_WASTE= ?, OTHER_WASTE= ?, DONOR_COUNTRY= ?, DONOR_STATE= ?, DONOR_CITY= ?, DONOR_PIN_OR_ZIP= ?, DONOR_ADDRESS= ?, DONOR_PHONE_NO= ?, DRYWASTE_IMAGE = ? where pickup_request_no = ?;", [data.donoraccount, data.plasticbottle, data.plastcwrapper, data.glassbottle, data.metalcans, data.paperbox, data.others, data.country, data.state, data.city, data.pin, data.address, data.phone, img, data.requestno], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(false)
                    }
                    resolve("Successfully updated pickup request(With File)");
                })
            });
    });
};

let updatePickupInfoWithoutFile = (data) => {
    console.log('pickuprequestService: updatePickupInfoWithoutFile')
    return new Promise(async (resolve, reject) => {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("UPDATE "+process.env.DB_SCHEMA+".pickup_request SET DONOR_ACCOUNT = ?, PLASTIC_BOTTLE = ?, PLASTIC_WRAPPER= ?, GLASS_BOTTLE= ?, METAL_CANS= ?, PAPER_WASTE= ?, OTHER_WASTE= ?, DONOR_COUNTRY= ?, DONOR_STATE= ?, DONOR_CITY= ?, DONOR_PIN_OR_ZIP= ?, DONOR_ADDRESS= ?, DONOR_PHONE_NO= ? where pickup_request_no = ?;", [data.donoraccount, data.plasticbottle, data.plastcwrapper, data.glassbottle, data.metalcans, data.paperbox, data.others, data.country, data.state, data.city, data.pin, data.address, data.phone, data.requestno], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(false)
                    }
                    resolve("Successfully updated pickup request(Without File)");
                })
            });
    });
};

let deletePhysicalFile = (id) => {
    console.log('pickuprequestService: deletePhysicalFile')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".pickup_request where pickup_request_no=? with ur;", [id], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    else {
                    let fileinfo = rows;
                    const jsonData = JSON.stringify(fileinfo)
                    const removebracket1 = jsonData.replace('[','')
                    const removebracket2 = removebracket1.replace(']','')
                    const jsonParseobj = JSON.parse(removebracket2)
                    const filename = jsonParseobj.DRYWASTE_IMAGE
                    if (filename > '') {
                        const fs = require('fs')
                        const path = './src/public/images/uploaded_images/'+filename
                        fs.unlink(path, (err) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log('file is removed')
                            }
                        })
                    }
                    resolve();
                    }
                })
            });
        } catch (err) {
            reject(err);
        }
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
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".pickup_request WHERE donor_Country = ? and donor_state = ? and donor_PIN_OR_ZIP = ?  ORDER BY LAST_UPDATED_TS DESC with ur;", [RECEIVER_COUNTRY, RECEIVER_STATE, RECEIVER_PIN_OR_ZIP], function(err, rows) {
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
    createPickupRequestWithFile: createPickupRequestWithFile,
    createPickupRequestWithoutFile: createPickupRequestWithoutFile,
    getPickupRequestNumber: getPickupRequestNumber,
    extractPickupRequest: extractPickupRequest,
    getPickupForEditPage: getPickupForEditPage,
    updatePickupInfoWithFile: updatePickupInfoWithFile,
    updatePickupInfoWithoutFile: updatePickupInfoWithoutFile,
    deletePhysicalFile: deletePhysicalFile,
    deletePickupById: deletePickupById,
    getReceiverList: getReceiverList,
    getPickupList: getPickupList,
    getDonorList: getDonorList
};