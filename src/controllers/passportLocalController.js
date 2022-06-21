import passportLocal from "passport-local";
import passport from "passport";
import donorloginService from "../services/donorloginService";
import receiverloginService from "../services/receiverloginService";

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
    console.log('passportLocalController: initPassportLocal')
    passport.use(new LocalStrategy({
            usernameField: 'phone',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, phone, password, done) => {
            try {
                console.log('passportLocalController: calling from here')
                await donorloginService.findUserByPhone(phone).then(async (user) => {
                    if (!user) {
                        console.log('passportLocalController: going to check receiver')
                        await receiverloginService.findUserByPhone(phone).then(async (user) => {
                            if (!user) {
                                console.log('passportLocalController: not in receiver')
                                return done(null, false, req.flash("errors", `This user phone "${phone}" doesn't exist`));
                            }
                            if (user) {
                                console.log('passportLocalController: found in receiver')
                                let match = await receiverloginService.comparePassword(password, user);
                                if (match === true) {
                                    return done(null, user, null)
                                } else {
                                    return done(null, false, req.flash("errors", match)
                                    )
                                }
                            }
                        })
                    } else {
                    if (user) {
                        console.log('passportLocalController: found in donor')
                        let match = await donorloginService.comparePassword(password, user);
                        if (match === true) {
                            return done(null, user, null)
                        } else {
                            return done(null, false, req.flash("errors", match)
                            )
                        }
                    }
                }
                });
            } catch (err) {
                return done(null, false, { message: err });
            }
        }));

};

passport.serializeUser((user, done) => {
    console.log('passportLocalController: serializeUser')
    done(null, user);
});


passport.deserializeUser((user, done) => {
    console.log('passportLocalController: deserializeUser')
    const jsonData = JSON.stringify(user)
    const jsonParseObj = JSON.parse(jsonData)
    const jsonAccount = jsonParseObj.ACCOUNT
    const jsonRECORD_TYPE = jsonParseObj.RECORD_TYPE
    if (jsonRECORD_TYPE === 'D') {
        donorloginService.findUserByAccount(jsonAccount).then((user) => {
            return done(null, user);
        }).catch(error => {
            return done(error, null)
        });
    }

    if (jsonRECORD_TYPE === 'R') {
        receiverloginService.findUserByAccount(jsonAccount).then((user) => {
            return done(null, user);
        }).catch(error => {
            return done(error, null)
        });
    }
});

module.exports = initPassportLocal;