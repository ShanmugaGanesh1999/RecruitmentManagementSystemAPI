var mongoose = require("mongoose");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const InterviewSchema = new Schema({
    id: ObjectId,
    candidateId: { type: Schema.Types.ObjectId, ref: "candidate" },
    interviewerId: [{ type: Schema.Types.ObjectId, ref: "interviewer" }],
    meetLink: String,
    timing: Date,
});

const InterviewModel = mongoose.model("Interview", InterviewSchema);

function model() {
    return InterviewModel;
}

function createInterview(params) {
    return model().create(params);
}

function getAllInterview(callback) {
    model().find({}, (err, res) => {
        callback(err, res);
    });
}

function getInterviewById(id, callback) {
    let InterviewId = mongoose.Types.ObjectId(id);
    model().findOne({ _id: InterviewId }, (err, res) => {
        callback(err, res);
    });
}

function updateInterviewById(params, callback) {
    let interviewId = mongoose.Types.ObjectId(params.id);
    // console.log(InterviewId);
    model().findOneAndUpdate(
        { _id: interviewId },
        {
            $set: {
                interviewerId: params.interviewerId,
                candidateId: params.candidateId,
                meetLink: params.meetLink,
                timing: params.timing,
            },
        },
        { new: true },
        function (err, interview) {
            callback(null, interview);
        },
    );
}

function deleteInterviewById(id, callback) {
    let InterviewId = mongoose.Types.ObjectId(id);
    model().findOneAndDelete({ _id: InterviewId }, (err, res1) => {
        callback(err, res1);
    });
}

function getAllInterviewsByCandidates(params, callback) {
    if (params.searchText != "") {
        var query = {};
        if (params.searchText) {
            query = {
                name: {
                    $regex: new RegExp(params.searchText, "i"),
                },
            };
        }
        var aggregate = [
            {
                $lookup: {
                    from: "candidates",
                    localField: "candidateId",
                    foreignField: "_id",
                    as: "candidates",
                },
            },
            {
                $unwind: {
                    path: "$candidates",
                },
            },
            {
                $match: {
                    "candidates.name": query.name,
                },
            },
            {
                $project: {
                    name: "$candidates.name",
                    emailId: "$candidates.emailId",
                    candidateId: "$candidateId",
                    organization: "$candidates.organization",
                    meetLink: "$meetLink",
                    interviewerId: "$interviewerId",
                    timing: "$timing",
                    status: "$candidates.status",
                },
            },
        ];
    } else {
        var aggregate = [
            {
                $lookup: {
                    from: "candidates",
                    localField: "candidateId",
                    foreignField: "_id",
                    as: "candidates",
                },
            },
            {
                $unwind: {
                    path: "$candidates",
                },
            },
            {
                $project: {
                    name: "$candidates.name",
                    emailId: "$candidates.emailId",
                    candidateId: "$candidateId",
                    organization: "$candidates.organization",
                    meetLink: "$meetLink",
                    interviewerId: "$interviewerId",
                    timing: "$timing",
                    status: "$candidates.status",
                },
            },
        ];
    }
    model()
        .aggregate(aggregate, (err, res2) => {
            callback(err, res2);
        })
        .skip(parseInt(params.skip))
        .limit(parseInt(params.limit));
}

function getAllInterviewsByCandidates1(callback) {
    model().aggregate(
        [
            {
                $lookup: {
                    from: "candidates",
                    localField: "candidateId",
                    foreignField: "_id",
                    as: "candidates",
                },
            },
            {
                $unwind: {
                    path: "$candidates",
                },
            },
            {
                $project: {
                    name: "$candidates.name",
                    emailId: "$candidates.emailId",
                    candidateId: "$candidateId",
                    organization: "$candidates.organization",
                    meetLink: "$meetLink",
                    interviewerId: "$interviewerId",
                    timing: "$timing",
                    status: "$candidates.status",
                },
            },
        ],
        (err, res) => callback(err, res),
    );
}

function getInterviewByCandidateId(id, callback) {
    let candidateId = mongoose.Types.ObjectId(id);
    model().findOne({ candidateId: candidateId }, (err, res) => {
        callback(err, res);
    });
}

function getDetailsByInterviewerId(params, callback) {
    if (params.searchText != "") {
        var query = {};
        if (params.searchText) {
            query = {
                name: {
                    $regex: new RegExp(params.searchText, "i"),
                },
            };
        }
        let interviewerId = mongoose.Types.ObjectId(params.interviewerId);
        var aggregate = [
            {
                $lookup: {
                    from: "candidates",
                    localField: "candidateId",
                    foreignField: "_id",
                    as: "candidates",
                },
            },
            {
                $unwind: {
                    path: "$candidates",
                },
            },
            {
                $match: {
                    $and: [
                        { interviewerId: interviewerId },
                        { "candidates.name": query.name },
                    ],
                },
            },
            {
                $project: {
                    name: "$candidates.name",
                    emailId: "$candidates.emailId",
                    mobileNo: "$candidates.mobileNo",
                    candidateId: "$candidateId",
                    organization: "$candidates.organization",
                    meetLink: "$meetLink",
                    interviewerId: "$interviewerId",
                    timing: "$timing",
                    status: "$candidates.status",
                },
            },
        ];
    } else {
        let interviewerId = mongoose.Types.ObjectId(params.interviewerId);
        var aggregate = [
            {
                $lookup: {
                    from: "candidates",
                    localField: "candidateId",
                    foreignField: "_id",
                    as: "candidates",
                },
            },
            {
                $unwind: {
                    path: "$candidates",
                },
            },
            {
                $match: {
                    interviewerId: interviewerId,
                },
            },
            {
                $project: {
                    name: "$candidates.name",
                    emailId: "$candidates.emailId",
                    mobileNo: "$candidates.mobileNo",
                    candidateId: "$candidateId",
                    meetLink: "$meetLink",
                    interviewerId: "$interviewerId",
                    timing: "$timing",
                    status: "$candidates.status",
                },
            },
        ];
    }
    model()
        .aggregate(aggregate, (err, res1) => {
            callback(err, res1);
        })
        .skip(parseInt(params.skip))
        .limit(parseInt(params.limit));
}

function getDetailByInterviewerId(params, callback) {
    let interviewerId = mongoose.Types.ObjectId(params);
    var aggregate = [
        {
            $lookup: {
                from: "candidates",
                localField: "candidateId",
                foreignField: "_id",
                as: "candidates",
            },
        },
        {
            $unwind: {
                path: "$candidates",
            },
        },
        {
            $match: {
                interviewerId: interviewerId,
            },
        },
        {
            $project: {
                name: "$candidates.name",
                emailId: "$candidates.emailId",
                mobileNo: "$candidates.mobileNo",
                candidateId: "$candidateId",
                meetLink: "$meetLink",
                interviewerId: "$interviewerId",
                timing: "$timing",
                status: "$candidates.status",
            },
        },
    ];
    model().aggregate(aggregate, (err, res1) => {
        callback(err, res1);
    });
}
module.exports = {
    model,
    createInterview,
    getAllInterview,
    getInterviewById,
    updateInterviewById,
    deleteInterviewById,
    getAllInterviewsByCandidates,
    getAllInterviewsByCandidates1,
    getInterviewByCandidateId,
    getDetailsByInterviewerId,
    getDetailByInterviewerId,
};
