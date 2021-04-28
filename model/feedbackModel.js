var mongoose = require("mongoose");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const FeedbackSchema = new Schema({
    id: ObjectId,
    name: String,
    interviewId: { type: Schema.Types.ObjectId, ref: "interview" },
    interviewerId: { type: Schema.Types.ObjectId, ref: "interviewer" },
    feedback: String,
    rating: Number,
});

const FeedbackModel = mongoose.model("Feedback", FeedbackSchema);

function model() {
    return FeedbackModel;
}

function createFeedback(params) {
    return model().create(params);
}

function getAllFeedback(callback) {
    model().find({}, (err, res) => {
        callback(err, res);
    });
}

function getFeedbackById(id, callback) {
    let FeedbackId = mongoose.Types.ObjectId(id);
    model().findOne({ _id: FeedbackId }, (err, res) => {
        callback(err, res);
    });
}

function getFeedbackByIntAndIntrId(intid, intrid, callback) {
    let intId = mongoose.Types.ObjectId(intid),
        intrId = mongoose.Types.ObjectId(intrid);
    model().findOne(
        { interviewId: intId, interviewerId: intrId },
        (err, res) => {
            callback(err, res);
        },
    );
}

function getFeedbackByIntId(intid, callback) {
    let intId = mongoose.Types.ObjectId(intid);
    model().aggregate(
        [
            {
                $lookup: {
                    from: "interviewers",
                    localField: "interviewerId",
                    foreignField: "_id",
                    as: "intr",
                },
            },
            {
                $unwind: {
                    path: "$intr",
                },
            },
            {
                $match: {
                    interviewId: intId,
                },
            },
            {
                $group: {
                    _id: intId,
                    count: { $sum: 1 },
                    feedbacks: {
                        $push: {
                            interviewerId: "$interviewerId",
                            name: "$intr.name",
                            feedback: "$feedback",
                            rating: "$rating",
                        },
                    },
                },
            },
        ],
        (err, res) => {
            callback(err, res);
        },
    );
}

function updateFeedbackById(params, callback) {
    let FeedbackId = mongoose.Types.ObjectId(params.id);
    model().findOneAndUpdate(
        { _id: FeedbackId },
        {
            $set: {
                feedback: params.feedback,
                rating: params.rating,
            },
        },
        { new: true },
        (err, res) => {
            callback(err, res);
        },
    );
}

function updateFeedbackByintIdAndIntrId(params, callback) {
    let intId = mongoose.Types.ObjectId(params.interviewId),
        intrId = mongoose.Types.ObjectId(params.interviewerId);
    model().findOneAndUpdate(
        { interviewId: intId, interviewerId: intrId },
        {
            $set: {
                feedback: params.feedback,
                rating: params.rating,
            },
        },
        { new: true },
        (err, res) => {
            callback(err, res);
        },
    );
}

function deleteFeedbackById(id, callback) {
    let FeedbackId = mongoose.Types.ObjectId(id);
    model().findOneAndDelete({ _id: FeedbackId }, (err, res1) => {
        callback(err, res1);
    });
}

module.exports = {
    model,
    createFeedback,
    getAllFeedback,
    getFeedbackById,
    getFeedbackByIntAndIntrId,
    getFeedbackByIntId,
    updateFeedbackByintIdAndIntrId,
    updateFeedbackById,
    deleteFeedbackById,
};
