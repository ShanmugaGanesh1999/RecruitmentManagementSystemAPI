var express = require("express");
var router = express.Router();

var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");
var blacklistModel = require("../model/blacklistModel");
var candidatesModel = require("../model/candidatesModel");

/**
 * @swagger
 * /candidates/createCandidate/:
 *   post:
 *     summary: To create candidate
 *     tags:
 *       - candidates
 *     description: To create candidate
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: candidate
 *         description: To create candidate
 *         in: body
 *         default: '{"name":"Harsheni","emailId":"harsheni@gmail.com","mobileNo":"7871894772","organization":"Augusta","domain":"Engineer","resume":"https://file.io/lNR0pCZogBjf"}'
 *         schema:
 *           $ref: '#/definitions/createCandidates'
 *     responses:
 *       200:
 *         description: Successfully created candidate
 */
/**
 * @swagger
 * definitions:
 *   createCandidates:
 *     properties:
 *       name:
 *         type: string
 *       emailId:
 *         type: string
 *       mobileNo:
 *         type: number
 *       organization:
 *         type: string
 *       domain:
 *         type: string
 *       resume:
 *         type: string
 */
router.post(
    "/createCandidate",
    verifyToken.verifyToken,
    async function (req, res, next) {
        try {
            emailId = req.body.emailId;
            var candidateEmail = await candidatesModel
                .model()
                .find({ emailId: emailId });
            //console.log(req.body);
            let candidateData = req.body;
            candidateData.status = "Pending...";
            if (candidateEmail == "") {
                candidatesModel
                    .createCandidate(candidateData)
                    .then((data) => {
                        res.status(200).json({
                            message: "Successfully created candidate",
                            data: data,
                        });
                    })
                    .catch((error) => {
                        res.status(403).json({
                            message: error,
                        });
                    });
            } else {
                res.status(403).json({
                    message: "Candidate already created.",
                });
            }
        } catch (error) {
            res.status(403).json({
                message: error.message,
            });
        }
    },
);

/**
 * @swagger
 * /candidates/getAllCandidates/:
 *   get:
 *     summary: Get all candidates
 *     tags:
 *       - candidates
 *     description: Get all candidates
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
 *         description: Successfully fetched all candidates
 */
router.get("/getAllCandidates", verifyToken.verifyToken, function (req, res) {
    candidatesModel.getAllCandidates((err, res1) => {
        try {
            if (res1.length > 0) {
                res.status(200).json({
                    message: "Fetched all candidates",
                    data: res1,
                });
            } else {
                res.status(404).json({
                    message: "No candidates",
                });
            }
        } catch (error) {
            res.status(404).json({
                error: error,
            });
        }
    });
});

/**
 * @swagger
 * /candidates/getCandidatesById/:
 *   get:
 *     summary: Get details of an candidates by Id
 *     tags:
 *       - candidates
 *     description: Get details of an candidates by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: id
 *         description: candidatesId
 *         type: string
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description:  Get details of an candidate
 */
router.get(
    "/getCandidatesById",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            var candidateId = req.query.id;
            var candidate = await candidatesModel
                .model()
                .find({ _id: candidateId });
            if (candidate != "") {
                res.status(200).json({
                    message: "Fetched details of candidate successfully",
                    data: candidate,
                });
            } else {
                res.status(404).json({
                    message: "No such candidate",
                });
            }
        } catch (error) {
            res.status(403).json({
                message: error.message,
            });
        }
    },
);

/**
 * @swagger
 * /candidates/updateCandidateById/:
 *   put:
 *     summary: Update candidates by id
 *     tags:
 *       - candidates
 *     description: Update candidates details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: candidates
 *         description: update candidates details
 *         in: body
 *         default: '{"id":"602506892adaf12ec80a2819","name":"Harsheni","emailId":"harsheni@gmail.com","mobileNo":"7871894772","organization":"Augusta","domain":"Lead","resume":"https://file.io/tIYNCKECtGQH",status":"pending..."}'
 *         schema:
 *           $ref: '#/definitions/updateCandidate'
 *     responses:
 *       200:
 *         description: Update candidates details Successfully
 */

/**
 * @swagger
 * definitions:
 *   updateCandidate:
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       emailId:
 *         type: string
 *       mobileNo:
 *         type: number
 *       organization:
 *         type: string
 *       domain:
 *         type: string
 *       resume:
 *         type: string
 *       status:
 *         type: string
 */

router.put(
    "/updateCandidateById",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            id = req.body.id;
            var candidateId = await candidatesModel.model().find({ _id: id });
            if (candidateId != "") {
                let candidate = req.body;
                candidatesModel.updateCandidateById(candidate, (err, res1) => {
                    if (err) {
                        res.status(403).json({
                            message: "Candidate not found",
                        });
                    } else {
                        res.status(200).json({
                            message: "Candidate details updated successfully",
                            data: res1,
                        });
                    }
                });
            } else {
                res.status(403).json({
                    message: "Candidate not found",
                });
            }
        } catch (error) {
            res.status(403).json({
                message: error.message,
            });
        }
    },
);

/**
 * @swagger
 * /candidates/updateCandidateStatusById/:
 *   put:
 *     summary: Update candidates by id
 *     tags:
 *       - candidates
 *     description: Update candidates details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: candidates
 *         description: update candidates details
 *         in: body
 *         default: '{"id":"602506892adaf12ec80a2819","status":"finished!"}'
 *         schema:
 *           $ref: '#/definitions/updateCandidate'
 *     responses:
 *       200:
 *         description: Update candidates details Successfully
 */

router.put(
    "/updateCandidateStatusById",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            id = req.body.id;
            var candidateId = await candidatesModel.model().find({ _id: id });
            if (candidateId != "") {
                let candidate = req.body;
                candidatesModel.updateCandidateStatusById(
                    candidate,
                    (err, res1) => {
                        if (err) {
                            res.status(403).json({
                                message: "Candidate not found",
                            });
                        } else {
                            res.status(200).json({
                                message:
                                    "Candidate details updated successfully",
                                data: res1,
                            });
                        }
                    },
                );
            } else {
                res.status(403).json({
                    message: "Candidate not found",
                });
            }
        } catch (error) {
            res.status(403).json({
                message: error.message,
            });
        }
    },
);

/**
 * @swagger
 * /candidates/deleteCandidatesById/:
 *   delete:
 *     summary: Delete details of an candidates by Id
 *     tags:
 *       - candidates
 *     description: Delete details of an candidates by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: id
 *         description: candidatesId
 *         type: string
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description:  Delete details of an candidates by Id
 */
router.delete(
    "/deleteCandidatesById",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            var candidateId = req.query.id;
            candidatesModel.deleteCandidatesById(
                candidateId,
                function (err, res1) {
                    if (res1 != null) {
                        res.status(200).json({
                            message: "Deleted the candidate successfully",
                            data: res1,
                        });
                    } else {
                        res.status(404).json({
                            message: "No such candidate",
                        });
                    }
                },
            );
        } catch (error) {
            res.status(403).json({
                message: error.message,
            });
        }
    },
);

module.exports = router;
