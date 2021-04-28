var express = require("express");
var router = express.Router();
var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");
var blacklistModel = require("../model/blacklistModel");
var interviewerModel = require("../model/interviewerModel");

/* GET interviewer listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

/**
 * @swagger
 * /interviewer/login:
 *   post:
 *     summary: Enter Login
 *     tags:
 *       - interviewer
 *     description: Enter the login data
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: login
 *         description: Enter the login data
 *         type: string
 *         in: body
 *         default: '{"emailId":"swetha@gmail.com","password":"swetha@11"}'
 *         schema:
 *           $ref: '#/definitions/memberLogin'
 *     responses:
 *       200:
 *         description: Enter the login data
 */
/**
 * @swagger
 * definitions:
 *   memberLogin:
 *     properties:
 *       emailId:
 *         type: string
 *       password:
 *         type: string
 */
router.post("/login", async function (req, res, next) {
    var interviewerData = await interviewerModel
        .model()
        .findOne({ emailId: req.body.emailId, password: req.body.password });
    if (interviewerData) {
        var token = utils.generateJwtToken({
            emailId: req.body.emailId,
            password: req.body.password,
        });
        res.status(200).send({
            message: "Member logged in successfully",
            token: token,
            data: interviewerData,
            role: interviewerData.role,
        });
    } else {
        res.status(404).send({
            message: "No member available",
        });
    }
});

/**
 * @swagger
 * /interviewer/resetPassword:
 *   put:
 *     summary: Password reset
 *     tags:
 *       - interviewer
 *     description: Password reset
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: resetPassword
 *         description: Password reset
 *         type: string
 *         in: body
 *         default: '{"emailId":"swetha@gmail.com","oldPassword":"swetha@123","newPassword":"swetha@11"}'
 *         schema:
 *           $ref: '#/definitions/exampleReset'
 *     responses:
 *       200:
 *         description: Password reset
 */
/**
 * @swagger
 * definitions:
 *   exampleReset:
 *     properties:
 *       emailId:
 *         type: string
 *       oldPassword:
 *         type: string
 *       newPassword:
 *         type: string
 */

router.put("/resetPassword", async function (req, res, next) {
    let data = {
        emailId: req.body.emailId,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
    };
    interviewerModel.resetPassword(data, (err, res1) => {
        if (err) {
            res.status(404).send({
                message: `Unable to reset password`,
            });
        } else {
            res.status(200).send({
                message: `Reset password successfully`,
            });
        }
    });
});

/**
 * @swagger
 * /interviewer/resetPwd:
 *   post:
 *     summary: interviewer logout
 *     tags:
 *       - interviewer
 *     description: interviewer logout
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: emailId
 *         description: email
 *         type: string
 *         required: true
 *         in: query
 *       - name: pwd
 *         description: password
 *         type: string
 *         required: true
 *         in: query
 *     responses:
 *       200:
 *         description: interviewer reset pwd
 */

router.post("/resetPwd", async function (req, res) {
    try {
        let mail = req.query.emailId,
            pwd = req.query.pwd;
        interviewerModel.resetPwd(mail, pwd, (err, res1) => {
            if (err) {
                res.status(404).json({
                    message: "reset pwd failed 0",
                    data: err,
                });
            } else {
                res.status(200).json({
                    message: "reset pwd success!",
                    data: res1,
                });
            }
        });
    } catch (error) {
        res.status(404).json({
            message: "reset pwd failed 1",
            data: error,
        });
    }
});

/**
 * @swagger
 * /interviewer/createInterviewer:
 *   post:
 *     summary: Create an interviewer
 *     tags:
 *       - interviewer
 *     description: Create a interviewer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: interviewerData
 *         description: Enter the interviewer data
 *         type: string
 *         in: body
 *         default: '{"name":"Swetha","emailId":"swetha@gmail.com","password":"swetha@11"}'
 *         schema:
 *           $ref: '#/definitions/createInterviewer'
 *     responses:
 *       200:
 *         description: Create an interviewer
 */
/**
 * @swagger
 * definitions:
 *   createInterviewer:
 *     properties:
 *       name:
 *         type: string
 *       emailId:
 *         type: string
 *       password:
 *         type: string
 */
router.post("/createInterviewer", function (req, res, next) {
    var details = req.body;
    var data = interviewerModel.createInterviewer(details);
    if (data) {
        res.status(200).json({
            message: "Created interviewer successfully",
        });
    } else {
        res.status(403).json({
            message: "Not created.",
        });
    }
});

/**
 * @swagger
 * /interviewer/getAllInterviewers/:
 *   get:
 *     summary: Get details of all the interviewers
 *     tags:
 *       - interviewer
 *     description: Get details of all the interviewers
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: x-access-token
 *          description: send valid token
 *          type: string
 *          required: true
 *          in: header
 *     responses:
 *       200:
 *         description:  Get details of all the interviewers
 */

router.get("/getAllInterviewers", verifyToken.verifyToken, function (req, res) {
    interviewerModel
        .getAllInterviewers()
        .then((interviewer) => {
            if (interviewer) {
                res.status(200).json({
                    message: "Fetched details of all interviewers successfully",
                    count: interviewer.length,
                    data: interviewer,
                });
            } else {
                res.status(404).json({
                    message: "No interviewer found",
                });
            }
        })
        .catch((err) => {
            res.status(404).json({
                message: err,
            });
        });
});

/**
 * @swagger
 * /interviewer/getInterviewerById:
 *   get:
 *     summary: Get details of a interviewer by Id
 *     tags:
 *       - interviewer
 *     description: Get details of a interviewer by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: id
 *         description: id
 *         type: string
 *         in: query
 *     responses:
 *       200:
 *         description:  Get details of an interviewer by Id
 */

router.get(
    "/getInterviewerById",
    verifyToken.verifyToken,
    function (req, res, next) {
        var id = req.query.id;
        // console.log(id);
        interviewerModel
            .getInterviewerById(id)
            .then((data) => {
                // console.log(data);
                if (data) {
                    res.status(200).json({
                        message: "Fetched details of interviewer successfully",
                        data: data,
                    });
                } else {
                    res.status(404).json({
                        message: "Details not found",
                    });
                }
            })
            .catch((err) => {
                res.status(404).json({
                    message: err,
                });
            });
    },
);

/**
 * @swagger
 * /interviewer/updateInterviewerById/:
 *   put:
 *     summary: Update interviewer details
 *     tags:
 *       - interviewer
 *     description: Update interviewer details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: body
 *         description: Id and details to be updated
 *         in: body
 *         default: '{"id":"602510453df858098c0ac1a9","name":"Swetha","emailId":"swetha@gmail.com","password":"swetha@123"}'
 *         schema:
 *           $ref: '#/definitions/update'
 *     responses:
 *       200:
 *         description: Successfully completed
 */

/**
 * @swagger
 * definitions:
 *   update:
 *     properties:
 *       name:
 *         type: string
 *       emailId:
 *         type: string
 *       password:
 *         type: string
 */

router.put(
    "/updateInterviewerById",
    verifyToken.verifyToken,
    function (req, res, next) {
        var details = req.body;
        interviewerModel.updateInterviewerById(details, function (err, data) {
            if (data) {
                res.status(200).json({
                    message: "Updated details of interviewer successfully",
                    data: data,
                });
            } else {
                res.status(404).json({
                    message: err,
                });
            }
        });
    },
);

/**
 * @swagger
 * /interviewer/deleteInterviewerById/:
 *   delete:
 *     summary: Delete details of a interviewer using Id
 *     tags:
 *       - interviewer
 *     description: Delete details of a interviewer using Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: id
 *         description: id
 *         type: string
 *         in: query
 *     responses:
 *       200:
 *         description:  Delete details of a interviewer using Id
 */

router.delete(
    "/deleteInterviewerById",
    verifyToken.verifyToken,
    function (req, res, next) {
        var id = req.query.id;
        interviewerModel.deleteInterviewerById(id, function (err, res1) {
            if (res1) {
                res.status(200).json({
                    message: "Deleted the interviewer successfully",
                    data: res1,
                });
            } else {
                res.status(404).json({
                    message: err,
                });
            }
        });
    },
);

/**
 * @swagger
 * /interviewer/logout:
 *   post:
 *     summary: interviewer logout
 *     tags:
 *       - interviewer
 *     description: interviewer logout
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *     responses:
 *       200:
 *         description: interviewer logout
 */

router.post(
    "/logout",
    verifyToken.verifyToken,
    async function (req, res, next) {
        var accessToken = req.headers["x-access-token"];
        // console.log(accessToken);
        blacklistModel.saveAccessToken(accessToken, function (err, result) {
            if (result) {
                res.status(200).send({
                    message: "Logged out successfully",
                    data: result,
                });
            } else {
                res.status(404).send({
                    message: "Unable to logout",
                    data: err,
                });
            }
        });
    },
);

/**
 * @swagger
 * /interviewer/getInterviewByInterviewerEmailId/:
 *   post:
 *     summary: Get details of an interview by interviewer EmailId
 *     tags:
 *       - interviewer
 *     description: Get details of an interview by interviewer mailId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: emailId
 *         description: interviewer mailId
 *         type: string
 *         in: formData
 *         default: 'swetha@gmail.com,karthik@gmail.com'
 *     responses:
 *       200:
 *         description: Get details of an interview by interviewer mailId successfully
 */

router.post(
    "/getInterviewByInterviewerEmailId",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            // var emailId = req.body.emailId.split(",");
            // var name = req.body.name.split(",");
            // var interviewerEmailIdArr = [];
            // var interviewerNameArr = [];
            // var interviewerName1Arr = [];
            // let length = emailId.length;
            // if (name.length == length) {
            //     for (let i = 0; i < length; i++) {
            //         var interviewerData = await interviewerModel
            //             .model()
            //             .findOne({
            //                 emailId: emailId[i],
            //             });
            //         interviewerEmailIdArr.push(interviewerData._id);
            //         interviewerNameArr.push(interviewerData.name);
            //         interviewerName1Arr.push(name[i]);
            //     }
            //     let count = 0;
            //     let decount = 0;
            //     for (let i = 0; i < interviewerNameArr.length; i++) {
            //         for (let j = 0; j < interviewerName1Arr.length; j++) {
            //             if (interviewerNameArr[i] == interviewerName1Arr[j]) {
            //                 count += 1;
            //             } else {
            //                 decount += 1;
            //             }
            //         }
            //     }
            //             if (count == interviewerNameArr.length) {
            //                 res.status(200).json({
            //                     data: interviewerEmailIdArr,
            //                 });
            //             } else {
            //                 res.status(403).json({
            //                     message:
            //                         "Selection of name should match with their respective email",
            //                 });
            //             }
            //         } else {
            //             res.status(403).json({
            //                 message: "Count of name and email should match",
            //             });
            //         }
            var emailId = req.body.emailId.split(",");
            var interviewerEmailIdArr = [];
            var interviewerNameArr = [];
            let length = emailId.length;
            for (let i = 0; i < length; i++) {
                var interviewerData = await interviewerModel.model().findOne({
                    emailId: emailId[i],
                });
                interviewerEmailIdArr.push(interviewerData._id);
                interviewerNameArr.push(interviewerData.name);
            }
            res.status(200).json({
                interviewerId: interviewerEmailIdArr,
                interviewerName: interviewerNameArr,
            });
        } catch (error) {
            res.status(403).json({
                message: error.message,
            });
        }
    },
);

/**
 * @swagger
 * /interviewer/getDetailsByInterviewerEmailId/:
 *   post:
 *     summary: Get details of an interview by interviewer EmailId
 *     tags:
 *       - interviewer
 *     description: Get details of an interview by interviewer mailId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: emailId
 *         description: interviewer mailId
 *         type: string
 *         in: formData
 *         default: 'swetha@gmail.com'
 *     responses:
 *       200:
 *         description: Get details of an interview by interviewer mailId successfully
 */

router.post(
    "/getDetailsByInterviewerEmailId",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            var emailId = req.body.emailId;
            // console.log("email", emailId);
            var interviewerData = await interviewerModel.model().findOne({
                emailId: emailId,
            });
            if (interviewerData) {
                res.status(200).json({
                    interviewerEmailId: interviewerData._id,
                });
            } else {
                res.status(403).json({
                    message: "No such email",
                });
            }
        } catch (error) {
            res.status(403).json({
                message: error.message,
            });
        }
    },
);

module.exports = router;
