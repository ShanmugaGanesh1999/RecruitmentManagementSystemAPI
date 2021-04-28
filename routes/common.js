var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var crypto = require("crypto");

var interviewerModel = require("../model/interviewerModel");
var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");

let otpArr = [];

function randomValueHex(len) {
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString("hex")
        .slice(0, len);
}

/**
 * @swagger
 * /common/commonLogin:
 *   post:
 *     summary: common Login
 *     tags:
 *       - common
 *     description: login by email and password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: login
 *         description: enter the login data
 *         type: string
 *         in: body
 *         default: '{"emailId":"hr.augusta@gmail.com","password":"Admin"}'
 *         schema:
 *           $ref: '#/definitions/exampleLogin'
 *     responses:
 *       200:
 *         description: login to perform operations
 */
/**
 * @swagger
 * definitions:
 *   exampleLogin:
 *     properties:
 *       emailId:
 *         type: string
 *       password:
 *         type: string
 */

router.post("/commonLogin", async function (req, res) {
    let email = req.body.emailId;
    let password = req.body.password;
    let data, local;
    data = await interviewerModel
        .model()
        .findOne({ emailId: email, password: password });
    if (data && email === "hr.augusta@gmail.com") {
        local = "hr";
    } else if (data) {
        local = "interviewer";
    }
    if (data) {
        var token = utils.generateJwtToken({
            email: email,
            password: req.body.password,
        });
        res.status(200).send({
            message: `Login as, ${email}`,
            id: data._id,
            path: local,
            token: token,
        });
    } else {
        res.status(404).send({
            message: `Unable to find customer`,
        });
    }
});

/**
 * @swagger
 * /common/emailOtp:
 *   post:
 *     summary: common email otp
 *     tags:
 *       - common
 *     description: login by email and password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: emailId
 *         description: enter the login data
 *         type: string
 *         in: query
 *         default: 'ramkumar@gmail.com'
 *     responses:
 *       200:
 *         description: login to perform operations
 */
router.post("/emailOtp", async function (req, res) {
    try {
        let emailId = req.query.emailId;
        if (emailId != undefined) {
            // console.log("email", emailId);
            var otp6 = randomValueHex(6);
            otpArr.push(otp6);
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "shanmuga.automail@gmail.com",
                    pass: "cnCx-Zr2XbF3!m!",
                },
            });
            var fillData = `<p style="color: #4c4c4c;font-weight: 400;font-size: 16px;line-height: 1.25;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif">Dear Candidate,
                <br><br>Your Interviewer email verification OTP for activating interviewer account is : 
                </p><h1 style="color:black">${otp6}<h1><p  style="font-weight: 400;font-size: 16px;line-height: 1.25;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:red;background-color:yellow;width:38%">This is an auto-generated mail, please do not reply!</p>`;
            // var fillData = `Dear Candidate, this is an auto-generated mail, please do not reply! <br>Interviewer Email Verification<br><br>
            //             Your OTP is, "${otp6}" for creating interviewer account!`;
            let mailOptions = {
                from: "shanmuga.automail@gmail.com",
                to: `${emailId}`,
                subject:
                    "Recruitment System: Interviewer Email OTP verification",
                html: fillData,
            };
            transporter.sendMail(mailOptions, (err2, res2) => {
                if (err2) {
                    res.status(404).json({
                        message: `OTP failed maybe that's not a valid mailId:${emailId}`,
                    });
                } else {
                    // console.log(res2);
                    res.status(200).json({
                        message: `OTP mailed to ${emailId}`,
                        otp: otp6,
                        data: res2,
                    });
                }
            });
        } else {
            res.status(404).json({
                message: `enter email`,
            });
        }
    } catch (error) {
        res.status(404).json({
            message: `OTP failed`,
        });
    }
});

/**
 * @swagger
 * /common/verifyOtp:
 *   post:
 *     summary: common email otp
 *     tags:
 *       - common
 *     description: login by email and password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: otp
 *         description: enter the login data
 *         type: string
 *         in: query
 *     responses:
 *       200:
 *         description: login to perform operations
 */
router.post("/verifyOtp", async function (req, res) {
    try {
        let otp = req.query.otp;
        let popOTP = otpArr.pop();
        if (otp != undefined && popOTP != undefined) {
            if (otp == popOTP) {
                res.status(200).json({
                    message: `OTP matched!`,
                    data: 1,
                });
            } else {
                res.status(404).json({
                    message: `OTP Not matched`,
                    data: 0,
                });
            }
        } else {
            res.status(404).json({
                message: `not an email`,
            });
        }
    } catch (error) {
        res.status(404).json({
            message: `OTP failed`,
        });
    }
});

/**
 * @swagger
 * /common/sendMail:
 *   post:
 *     summary: send interview confirmation email
 *     tags:
 *       - common
 *     description: send email
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: candidate
 *         description: candidate interview details
 *         in: body
 *         schema:
 *           $ref: '#/definitions/candidatesInterview'
 *     responses:
 *       200:
 *         description: send interview confirmation email
 */
/**
 * @swagger
 * definitions:
 *   candidatesInterview:
 *     properties:
 *       name:
 *         type: string
 *       emailId:
 *         type: string
 *       interviewerName:
 *         type: string
 *       interviewersEmailId:
 *         type: string
 *       meetLink:
 *         type: string
 *       date:
 *         type: date
 *       time:
 *         type: time
 *       shortLink:
 *         type: string
 */
router.post("/sendMail", verifyToken.verifyToken, function (req, res) {
    var candidatesData = req.body;
    // console.log(candidatesData);
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "shanmuga.automail@gmail.com",
            pass: "cnCx-Zr2XbF3!m!",
        },
    });
    var fillData =
        "Dear " +
        candidatesData.name +
        "," +
        "<br><br>Congratulations! You have been invited to attend an interview round of AugustaHiTech Campus Recruitment Program 2020-21.<br><br> Below are the details for your interview with us:<br><br>Date : " +
        candidatesData.date +
        "<br><br>Time :" +
        candidatesData.time +
        "<br><br>Duration: 1 hour<br><br>Interview google meet link: https://meet.google.com/" +
        candidatesData.meetLink +
        '<br><br><br>In case of any query, please free to reach us at <a href="mailto:harshenic@gmail.com">harshenic@gmail.com</a>' +
        "<br><br><br>Best Regards,<br><br>AugustaHiTech Pvt Ltd" +
        `<br><br><p  style="font-weight: 400;font-size: 16px;line-height: 1.25;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:red;background-color:yellow;width:38%">This is an auto-generated mail, please do not reply!</p>`;
    var mailOptions = {
        from: "harshenic@gmail.com",
        to: candidatesData.emailId,
        subject:
            "Recruitment System: Your interview with AugustaHiTech has been schedulded",
        html: fillData,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "shanmuga.automail@gmail.com",
                    pass: "cnCx-Zr2XbF3!m!",
                },
            });
            var fillData =
                "Dear " +
                candidatesData.interviewerName +
                "," +
                "<br><br>Candidate Resume ( click this link to download candidate resume ) :" +
                candidatesData.shortLink +
                "<br><br>You are requested to take an interview round of AugustaHiTech Campus Recruitment Program 2020-21.<br><br> Below are the details for your scheduled interview :<br><br>Date : " +
                candidatesData.date +
                "<br><br>Time :" +
                candidatesData.time +
                "<br><br>Duration: 1 hour<br><br>Interview google meet link: https://meet.google.com/" +
                candidatesData.meetLink +
                '<br><br><br>In case of any query, please free to reach us at <a href="mailto:harshenic@gmail.com">harshenic@gmail.com</a>' +
                "<br><br><br>Best Regards,<br><br>HR<br>AugustaHiTech Pvt Ltd" +
                `<br><br><p  style="font-weight: 400;font-size: 16px;line-height: 1.25;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:red;background-color:yellow;width:38%">This is an auto-generated mail, please do not reply!</p>`;
            var mailOptions = {
                from: "harshenic@gmail.com",
                to: `${candidatesData.interviewersEmailId}`,
                subject: "Recruitment System: Scheduled interview",
                html: fillData,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    // console.log("Email sent: " + info.response);
                    res.json({
                        message: "Email sent successfully",
                    });
                }
            });
        }
    });
});

/**
 * @swagger
 * /common/forgotPwd:
 *   post:
 *     summary: common email otp
 *     tags:
 *       - common
 *     description: login by email and password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: emailId
 *         description: enter the login data
 *         type: string
 *         in: query
 *         default: 'ramkumar@gmail.com'
 *     responses:
 *       200:
 *         description: login to perform operations
 */
router.post("/forgotPwd", async function (req, res) {
    try {
        let email = req.query.emailId;
        if (email != undefined) {
            let found = interviewerModel.model().find({ emailId: email });
            // console.log("eeeeeee", found);
            if (found) {
                var otp6 = randomValueHex(6);
                otpArr.push(otp6);
                let transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "shanmuga.automail@gmail.com",
                        pass: "cnCx-Zr2XbF3!m!",
                    },
                });
                var fillData =
                    `<p style="color: #4c4c4c;font-weight: 400;font-size: 16px;line-height: 1.25;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif">Hi there,
                    <br><br>We received a request to reset the password on your interviewer account.
                    <br><h1>${otp6}</h1></p><p style="color: #4c4c4c;font-weight: 400;font-size: 16px;line-height: 1.25;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif">Enter this OTP to complete the reset.</p>` +
                    `<br><br><p  style="font-weight: 400;font-size: 16px;line-height: 1.25;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:red;background-color:yellow;width:38%">This is an auto-generated mail, please do not reply!</p>`;
                let mailOptions = {
                    from: "shanmuga.automail@gmail.com",
                    to: `${email}`,
                    subject: "Recruitment System: Reset Password",
                    // text: `Dear Candidate, this is an auto-generated mail, please do not reply!
                    //                         Interviewer Password reset
                    //     Your OTP is, "${otp6}" for reseting your interviewer account!`,
                    html: fillData,
                };
                transporter.sendMail(mailOptions, (err2, res2) => {
                    if (err2) console.log(err2);
                    else {
                        // console.log(res2);
                        res.status(200).json({
                            message: `OTP mailed to ${email}`,
                            otp: otp6,
                            data: res2,
                        });
                    }
                });
            } else {
                res.status(404).json({
                    message: `Unable to find user!`,
                });
            }
        } else {
            res.status(404).json({
                message: `not an email`,
            });
        }
    } catch (error) {
        res.status(404).json({
            message: `OTP failed`,
        });
    }
});

/**
 * @swagger
 * /common/notifyCandidate:
 *   post:
 *     summary: common email otp
 *     tags:
 *       - common
 *     description: login by email and password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: emailId
 *         description: enter the login data
 *         type: string
 *         in: query
 *         default: 'ramkumar@gmail.com'
 *       - name: message
 *         description: enter message
 *         type: string
 *         in: query
 *     responses:
 *       200:
 *         description: login to perform operations
 */
router.post("/notifyCandidate", async function (req, res) {
    try {
        let emailId = req.query.emailId;
        let message = req.query.message;
        if (emailId != undefined) {
            // console.log("email", emailId);
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "shanmuga.automail@gmail.com",
                    pass: "cnCx-Zr2XbF3!m!",
                },
            });
            var fillData = `Dear Candidate,<br><br>Results For the interview<br><br>
                       ${message}`;
            let mailOptions = {
                from: "shanmuga.automail@gmail.com",
                to: `${emailId}`,
                subject: "Recruitment System: Augusta HiTech Interview Results",
                html: fillData,
            };
            transporter.sendMail(mailOptions, (err2, res2) => {
                if (err2) console.log(err2);
                else {
                    // console.log(res2);
                    res.status(200).json({
                        message: `OTP mailed to ${emailId}`,
                        otp: otp6,
                        data: res2,
                    });
                }
            });
        } else {
            res.status(404).json({
                message: `not an email`,
            });
        }
    } catch (error) {
        res.status(404).json({
            message: `OTP failed`,
        });
    }
});

/**
 * @swagger
 * /common/updateInterviewDetails:
 *   post:
 *     summary: send interview confirmation email
 *     tags:
 *       - common
 *     description: send email
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: candidate
 *         description: candidate interview details
 *         in: body
 *         schema:
 *           $ref: '#/definitions/candidatesInterview'
 *     responses:
 *       200:
 *         description: send interview confirmation email
 */
/**
 * @swagger
 * definitions:
 *   candidatesInterview:
 *     properties:
 *       name:
 *         type: string
 *       emailId:
 *         type: string
 *       interviewerName:
 *         type: string
 *       interviewersEmailId:
 *         type: string
 *       meetLink:
 *         type: string
 *       date:
 *         type: date
 *       time:
 *         type: time
 *       shortLink:
 *         type: string
 */
router.post(
    "/updateInterviewDetails",
    verifyToken.verifyToken,
    function (req, res) {
        var candidatesData = req.body;
        // console.log(candidatesData);
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "shanmuga.automail@gmail.com",
                pass: "cnCx-Zr2XbF3!m!",
            },
        });
        var fillData =
            "Dear " +
            candidatesData.name +
            "," +
            "<br><br>Your interview has been rescheduled. Please check the below details for information.<br><br>Date :" +
            candidatesData.date +
            "<br><br>Time :" +
            candidatesData.time +
            "<br><br>Duration: 1 hour<br><br>Interview google meet link: https://meet.google.com/" +
            candidatesData.meetLink +
            '<br><br><br>In case of any query, please free to reach us at <a href="mailto:harshenic@gmail.com">harshenic@gmail.com</a>' +
            "<br><br>All the best!" +
            "<br><br><br>Best Regards,<br><br>AugustaHiTech Pvt Ltd";
        var mailOptions = {
            from: "harshenic@gmail.com",
            to: candidatesData.emailId,
            subject: "Your interview with AugustaHiTech has been rescheduled",
            html: fillData,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "shanmuga.automail@gmail.com",
                        pass: "cnCx-Zr2XbF3!m!",
                    },
                });
                var fillData =
                    "Dear " +
                    candidatesData.interviewerName +
                    "," +
                    "<br><br>Your interview with candidate " +
                    candidatesData.name +
                    " has been rescheduled" +
                    "<br><br> Below are the details for the rescheduled interview :" +
                    "<br><br>Candidate Resume ( click this link to download candidate resume ) :" +
                    candidatesData.shortLink +
                    "<br><br>Date : " +
                    candidatesData.date +
                    "<br><br>Time :" +
                    candidatesData.time +
                    "<br><br>Duration: 1 hour<br><br>Interview google meet link: https://meet.google.com/" +
                    candidatesData.meetLink +
                    '<br><br><br>In case of any query, please free to reach us at <a href="mailto:harshenic@gmail.com">harshenic@gmail.com</a>' +
                    "<br><br><br>Best Regards,<br><br>HR<br>AugustaHiTech Pvt Ltd";
                var mailOptions = {
                    from: "harshenic@gmail.com",
                    to: `${candidatesData.interviewersEmailId}`,
                    subject: "Rescheduled interview Details",
                    html: fillData,
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        // console.log("Email sent: " + info.response);
                        res.json({
                            message: "Email sent successfully",
                        });
                    }
                });
            }
        });
    },
);

module.exports = router;
