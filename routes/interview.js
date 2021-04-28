var express = require("express");
var router = express.Router();

var interviewModel = require("../model/interviewModel");
var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");

/* GET interview listing. */
router.get("/", function (req, res) {
    res.send("interview...");
});

/**
 * @swagger
 * /interview/createInterview/:
 *   post:
 *     summary: Create interview
 *     tags:
 *       - interview
 *     description: Create interview
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: candidateId
 *         description: candidateId
 *         type: string
 *         in: formData
 *         required: true
 *       - name: interviewerId
 *         description: interviewerId
 *         type: string
 *         in: formData
 *         required: true
 *       - name: meetLink
 *         description: meetLink
 *         type: string
 *         in: formData
 *         required: true
 *       - name: timing
 *         description: timing
 *         type: Date
 *         default: '2021-02-11T18:30:00.000Z'
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: interview created successfully
 */

router.post("/createInterview", function (req, res) {
    let interviewerArr = req.body.interviewerId.split(",");
    let interview = {
        candidateId: req.body.candidateId,
        interviewerId: interviewerArr,
        meetLink: req.body.meetLink,
        timing: req.body.timing,
    };
    try {
        var interviewData = interviewModel.createInterview(interview);
        if (interviewData) {
            res.status(200).json({
                message: `interview ${interview.candidateId} created successfully`,
                data: interviewData,
            });
        } else {
            res.status(403).json({
                message: "interview created failed",
            });
        }
    } catch (error) {
        res.status(403).json({
            message: error.message,
            error,
        });
    }
});

/**
 * @swagger
 * /interview/getAllInterview/:
 *   get:
 *     summary: get all interview
 *     tags:
 *       - interview
 *     description: get all interview
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
 *         description: get all interview
 */

router.get(
    "/getAllInterview",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            interviewModel.getAllInterview(async (err, res1) => {
                if (err) {
                    res.status(403).json({
                        message: "interview retrival failed",
                    });
                } else {
                    res.status(200).json({
                        message: `All interview retrived successfully`,
                        data: res1,
                    });
                }
            });
        } catch (error) {
            res.status(403).json({
                message: error.message,
                error,
            });
        }
    },
);

/**
 * @swagger
 * /interview/getInterviewById/:
 *   get:
 *     summary: Get details of an interview by Id
 *     tags:
 *       - interview
 *     description: Get details of an interview by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: id
 *         description: interview id
 *         type: string
 *         required: true
 *         in: query
 *     responses:
 *       200:
 *         description:  Get details of an Employee by Id
 */
router.get(
    "/getInterviewById",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            let id = req.query.id;
            interviewModel.getInterviewById(id, (err, res1) => {
                if (err) {
                    res.status(403).json({
                        message: `interview of id:${id} not found`,
                    });
                } else {
                    res.status(200).json({
                        message: `interview of id:${id} found`,
                        data: res1,
                    });
                }
            });
        } catch (error) {
            res.status(403).json({
                message: error.message,
                error,
            });
        }
    },
);

/**
 * @swagger
 * /interview/updateInterviewById/:
 *   put:
 *     summary: Update interview by id
 *     tags:
 *       - interview
 *     description: Update interview details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: interview
 *         description: Id and details to be updated
 *         in: body
 *         default: '{"id":"602522774ad2c939e4f0b722","candidateId":"6025173a9300b6212c7beee1","interviewerId":"602510453df858098c0ac1a9","meetLink":"gaz-rrwv-ndf","timing":"02-12-2021T12:05:45"}'
 *         schema:
 *           $ref: '#/definitions/updateInterview'
 *     responses:
 *       200:
 *         description: Update interview details Successfully
 */
/**
 * @swagger
 * definitions:
 *   updateInterview:
 *     properties:
 *       id:
 *         type: string
 *       candidateId:
 *         type: string
 *       interviewerId:
 *         type: string
 *       meetLink:
 *         type: string
 *       timing:
 *         type: date
 */

router.put(
    "/updateInterviewById",
    // //verifyToken.verifyToken,
    async function (req, res) {
        try {
            var interviewId = req.body.id;
            var interview = await interviewModel
                .model()
                .find({ _id: interviewId });
            if (interview != "") {
                let interview = req.body;
                interviewModel.updateInterviewById(interview, (err, res1) => {
                    if (err) {
                        res.status(403).json({
                            message: `interview of id:${interview.id} not found`,
                        });
                    } else {
                        res.status(200).json({
                            message: `interview of id:${interview.id} found and updated`,
                            data: res1,
                        });
                    }
                });
            } else {
                res.status(403).json({
                    message: "Interview id not found",
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
 * /interview/deleteInterviewById/:
 *   delete:
 *     summary: Delete details of an interview by Id
 *     tags:
 *       - interview
 *     description: Delete details of an interview by Id
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
 *         required: true
 *         in: query
 *     responses:
 *       200:
 *         description:  Delete details of an interview by Id
 */
router.delete(
    "/deleteInterviewById",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            let id = req.query.id;
            interviewModel.deleteInterviewById(id, (err, res1) => {
                if (err) {
                    res.status(403).json({
                        message: `interview of id:${id} not found`,
                    });
                } else {
                    res.status(200).json({
                        message: `interview of id:${id} found and deleted`,
                        data: res1,
                    });
                }
            });
        } catch (error) {
            res.status(403).json({
                message: error.message,
                error,
            });
        }
    },
);

/**
 * @swagger
 * /interview/getAllInterviewsByCandidates/:
 *   get:
 *     summary: Get all interviews by candidates
 *     tags:
 *       - interview
 *     description: Get all interviews by candidates
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: skip
 *         description: skip
 *         type: number
 *         required: true
 *         in: query
 *       - name: limit
 *         description: limit
 *         type: number
 *         required: false
 *         in: query
 *       - name: searchText
 *         description: search text
 *         type: string
 *         required: false
 *         in: query
 *     responses:
 *       200:
 *         description: Successfully fetched all interviews by candidates
 */
router.get(
    "/getAllInterviewsByCandidates",
    verifyToken.verifyToken,
    function (req, res) {
        var params = {
            skip: req.query.skip ? req.query.skip : "0",
            limit: req.query.limit ? req.query.limit : "5",
        };
        searchText = req.query.searchText ? req.query.searchText : "";
        params["searchText"] = searchText;
        // console.log(params);
        interviewModel.getAllInterviewsByCandidates(
            params,
            async (err, res1) => {
                try {
                    var searchDataCount = res1.length;
                    var length = await interviewModel.model().find({});
                    if (params.searchText.length != 0)
                        totalLength = searchDataCount;
                    else totalLength = length.length;
                    // console.log(searchDataCount);
                    if (res1.length > 0) {
                        res.status(200).json({
                            message: "Fetched all interview details",
                            data: res1,
                            searchDataCount: searchDataCount,
                            totalLength: totalLength,
                        });
                    } else {
                        // console.log("1");
                        res.status(404).json({
                            message: "Incorrect candidate name!",
                        });
                    }
                } catch (error) {
                    res.status(404).json({
                        error: error.message,
                    });
                }
            },
        );
    },
);

/**
 * @swagger
 * /interview/getAllInterviewsByCandidates1/:
 *   get:
 *     summary: Get all interviews by candidates
 *     tags:
 *       - interview
 *     description: Get all interviews by candidates
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
 *         description: Successfully fetched all interviews by candidates
 */

router.get(
    "/getAllInterviewsByCandidates1",
    verifyToken.verifyToken,
    function (req, res) {
        try {
            interviewModel.getAllInterviewsByCandidates1((err, res1) => {
                if (err) {
                    res.status(404).json({
                        error: err,
                    });
                } else {
                    res.status(200).json({
                        data: res1,
                    });
                }
            });
        } catch (error) {
            res.status(404).json({
                error: error.message,
            });
        }
    },
);

/**
 * @swagger
 * /interview/getInterviewByCandidateId/:
 *   get:
 *     summary: Get details of an interview by candidateId
 *     tags:
 *       - interview
 *     description: Get details of an interview by candidateId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: candidateId
 *         description: candidate id
 *         type: string
 *         required: true
 *         in: query
 *     responses:
 *       200:
 *         description:  Get details of an interview by Candidate Id
 */
router.get(
    "/getInterviewByCandidateId",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            let id = req.query.candidateId;
            // console.log(id);
            interviewModel.getInterviewByCandidateId(id, (err, res1) => {
                if (err) {
                    res.status(403).json({
                        message: `interview of id:${id} not found`,
                    });
                } else {
                    res.status(200).json({
                        message: `interview of id:${id} found`,
                        data: res1,
                    });
                }
            });
        } catch (error) {
            res.status(403).json({
                message: error.message,
                error,
            });
        }
    },
);

/**
 * @swagger
 * /interview/getDetailsByInterviewerId/:
 *   post:
 *     summary: Get details of an interview by interviewer EmailId
 *     tags:
 *       - interview
 *     description: Get details of an interview by interviewer mailId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: interviewerId
 *         description: interviewer mailId
 *         type: string
 *         in: formData
 *         default: '60260f72869f14122844c22a'
 *       - name: skip
 *         description: skip
 *         type: number
 *         required: true
 *         in: formData
 *       - name: limit
 *         description: limit
 *         type: number
 *         required: false
 *         in: formData
 *       - name: searchText
 *         description: search text
 *         type: string
 *         required: false
 *         in: formData
 *     responses:
 *       200:
 *         description: Get details of an interview by interviewer mailId successfully
 */

router.post(
    "/getDetailsByInterviewerId",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            var params = {
                skip: req.body.skip ? req.body.skip : "0",
                limit: req.body.limit ? req.body.limit : "5",
                interviewerId: req.body.interviewerId,
            };
            searchText = req.body.searchText ? req.body.searchText : "";
            params["searchText"] = searchText;
            interviewModel.getDetailsByInterviewerId(
                params,
                async function (err, res1) {
                    if (res1 != "") {
                        var searchDataCount = res1.length;
                        interviewModel.getDetailByInterviewerId(
                            params.interviewerId,
                            async function (err, res3) {
                                // console.log(params.searchText.length);
                                if (params.searchText.length != 0)
                                    totalLength = searchDataCount;
                                else totalLength = res3.length;
                                // console.log(res3);
                                if (res3.length > 0) {
                                    res.status(200).json({
                                        message:
                                            "Fetched all interview details",
                                        data: res1,
                                        searchDataCount: searchDataCount,
                                        totalLength: totalLength,
                                    });
                                } else {
                                    res.status(404).json({
                                        message: err.message,
                                    });
                                }
                            },
                        );
                    } else {
                        interviewModel.getDetailByInterviewerId(
                            params.interviewerId,
                            async function (err, res3) {
                                if (res3 != 0) {
                                    // console.log("1");
                                    res.status(404).json({
                                        message: "Incorrect candidate name",
                                    });
                                } else {
                                    // console.log("2");
                                    res.status(404).json({
                                        message: "No candidates assigned",
                                    });
                                }
                            },
                        );
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
