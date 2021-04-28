var express = require("express");
var router = express.Router();

var feedbackModel = require("../model/feedbackModel");
var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");

/* GET feedback listing. */
router.get("/", function (req, res) {
    res.send("feedback...");
});

/**
 * @swagger
 * /feedback/createFeedback/:
 *   post:
 *     summary: Create feedback
 *     tags:
 *       - feedback
 *     description: Create feedback
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: interviewId
 *         description: interviewId
 *         type: string
 *         in: formData
 *         required: true
 *       - name: interviewerId
 *         description: interviewerId
 *         type: string
 *         in: formData
 *         required: true
 *       - name: feedback
 *         description: feedback
 *         type: string
 *         in: formData
 *         required: true
 *       - name: rating
 *         description: rating
 *         type: number
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: feedback created successfully
 */

router.post(
    "/createFeedback",
    verifyToken.verifyToken,
    async function (req, res) {
        let feedback = {
            interviewId: req.body.interviewId,
            interviewerId: req.body.interviewerId,
            feedback: req.body.feedback,
            rating: req.body.rating,
        };
        try {
            var feedbackData = feedbackModel.createFeedback(feedback);
            if (feedbackData) {
                res.status(200).json({
                    message: `feedback ${feedback.interviewId} created successfully`,
                });
            } else {
                res.status(403).json({
                    message: "feedback created failed",
                });
            }
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
 * /feedback/getAllFeedback/:
 *   get:
 *     summary: get all feedback
 *     tags:
 *       - feedback
 *     description: get all feedback
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
 *         description: get all feedback
 */

router.get(
    "/getAllFeedback",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            feedbackModel.getAllFeedback(async (err, res1) => {
                if (err) {
                    res.status(403).json({
                        message: "feedback retrival failed",
                    });
                } else {
                    res.status(200).json({
                        message: `All feedback retrived successfully`,
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
 * /feedback/getFeedbackById/:
 *   get:
 *     summary: Get details of an feedback by Id
 *     tags:
 *       - feedback
 *     description: Get details of an feedback by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: id
 *         description: feedback id
 *         type: string
 *         required: true
 *         in: query
 *     responses:
 *       200:
 *         description:  Get details of an Employee by Id
 */
router.get(
    "/getFeedbackById",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            let id = req.query.id;
            feedbackModel.getFeedbackById(id, (err, res1) => {
                if (err) {
                    res.status(403).json({
                        message: `feedback of id:${id} not found`,
                    });
                } else {
                    res.status(200).json({
                        message: `feedback of id:${id} found`,
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
 * /feedback/getFeedbackByIntAndIntrId/:
 *   get:
 *     summary: Get details of an feedback by Id
 *     tags:
 *       - feedback
 *     description: Get details of an feedback by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: intId
 *         description: interview id
 *         type: string
 *         required: true
 *         in: query
 *       - name: intrId
 *         description: interviewer id
 *         type: string
 *         required: true
 *         in: query
 *     responses:
 *       200:
 *         description:  Get details of an Employee by Id
 */
router.get(
    "/getFeedbackByIntAndIntrId",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            let intId = req.query.intId,
                intrId = req.query.intrId;
            feedbackModel.getFeedbackByIntAndIntrId(
                intId,
                intrId,
                (err, res1) => {
                    if (err) {
                        res.status(404).json({
                            message: `feedback of id:${id} not found`,
                        });
                    } else {
                        res.status(200).json({
                            message: `feedback found`,
                            data: res1,
                        });
                    }
                },
            );
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
 * /feedback/getFeedbackByIntId/:
 *   get:
 *     summary: Get details of an feedback by Id
 *     tags:
 *       - feedback
 *     description: Get details of an feedback by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: intId
 *         description: feedback id
 *         type: string
 *         required: true
 *         in: query
 *     responses:
 *       200:
 *         description:  Get details of an Employee by Id
 */
router.get(
    "/getFeedbackByIntId",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            let intId = req.query.intId;
            feedbackModel.getFeedbackByIntId(intId, (err, res1) => {
                if (err) {
                    res.status(403).json({
                        message: `feedback of id:${intId} not found`,
                    });
                } else {
                    res.status(200).json({
                        message: `feedback of id:${intId} found`,
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
 * /feedback/updateFeedbackById/:
 *   put:
 *     summary: Update feedback by id
 *     tags:
 *       - feedback
 *     description: Update feedback details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: feedback
 *         description: Id and details to be updated
 *         in: body
 *         default: '{"id":"6025027287a25c2d08cefdd4","interviewId":"5fe06615a41f9e31489a9fe0","interviewerId":"5fe06615a41f9e31489a9fe0","feedback":"good!","rating":8}'
 *         schema:
 *           $ref: '#/definitions/updatefeedback'
 *     responses:
 *       200:
 *         description: Update feedback details Successfully
 */
/**
 * @swagger
 * definitions:
 *   updatefeedback:
 *     properties:
 *       id:
 *         type: string
 *       interviewId:
 *         type: string
 *       interviewerId:
 *         type: string
 *       feedback:
 *         type: string
 *       rating:
 *         type: number
 */

router.put(
    "/updateFeedbackById",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            let feedback = req.body;
            feedbackModel.updateFeedbackById(feedback, (err, res1) => {
                if (err) {
                    res.status(403).json({
                        message: `feedback of id:${feedback.id} not found`,
                    });
                } else {
                    res.status(200).json({
                        message: `feedback of id:${feedback.id} found and updated`,
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
 * /feedback/updateFeedbackByintIdAndIntrId/:
 *   put:
 *     summary: Update feedback by id
 *     tags:
 *       - feedback
 *     description: Update feedback details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *       - name: feedback
 *         description: Id and details to be updated
 *         in: body
 *         default: '{"interviewId":"5fe06615a41f9e31489a9fe0","interviewerId":"5fe06615a41f9e31489a9fe0","feedback":"good!","rating":8}'
 *         schema:
 *           $ref: '#/definitions/updatefeedback'
 *     responses:
 *       200:
 *         description: Update feedback details Successfully
 */
/**
 * @swagger
 * definitions:
 *   updatefeedback:
 *     properties:
 *       interviewId:
 *         type: string
 *       interviewerId:
 *         type: string
 *       feedback:
 *         type: string
 *       rating:
 *         type: number
 */

router.put(
    "/updateFeedbackByintIdAndIntrId",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            let feedback = req.body;
            feedbackModel.updateFeedbackByintIdAndIntrId(
                feedback,
                (err, res1) => {
                    if (err) {
                        res.status(403).json({
                            message: `feedback not found`,
                        });
                    } else {
                        res.status(200).json({
                            message: `feedback of found and updated`,
                            data: res1,
                        });
                    }
                },
            );
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
 * /feedback/deleteFeedbackById/:
 *   delete:
 *     summary: Delete details of an feedback by Id
 *     tags:
 *       - feedback
 *     description: Delete details of an feedback by Id
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
 *         description:  Delete details of an feedback by Id
 */
router.delete(
    "/deleteFeedbackById",
    verifyToken.verifyToken,
    async function (req, res) {
        try {
            let id = req.query.id;
            feedbackModel.deleteFeedbackById(id, (err, res1) => {
                if (err) {
                    res.status(403).json({
                        message: `feedback of id:${id} not found`,
                    });
                } else {
                    res.status(200).json({
                        message: `feedback of id:${id} found and deleted`,
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

module.exports = router;
