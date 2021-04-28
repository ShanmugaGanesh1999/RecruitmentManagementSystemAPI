var mongoose = require("mongoose");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const candidateSchema = new Schema({
    id: ObjectId,
    name: String,
    emailId: String,
    mobileNo: Number,
    organization: String,
    domain: String,
    resume: String,
    status: String,
});

const candidateModel = mongoose.model("candidate", candidateSchema);

function model() {
    return candidateModel;
}

function createCandidate(params) {
    return new Promise((response) => {
        response(model().create(params));
    });
}

function getAllCandidates(callback) {
    model().find({}, (err, res1) => {
        callback(err, res1);
    });
}

function updateCandidateById(params, callback) {
    let candidateId = mongoose.Types.ObjectId(params.id);
    model().findOneAndUpdate(
        { _id: candidateId },
        {
            $set: {
                name: params.name,
                email: params.email,
                mobileNo: params.mobileNo,
                organization: params.organization,
                domain: params.domain,
                resume: params.resume,
            },
        },
        { new: true },
        (err, res) => {
            callback(err, res);
        },
    );
}

function updateCandidateStatusById(params, callback) {
    let candidateId = mongoose.Types.ObjectId(params.id);
    model().findOneAndUpdate(
        { _id: candidateId },
        {
            $set: {
                status: params.status,
            },
        },
        { new: true },
        (err, res) => {
            callback(err, res);
        },
    );
}

function deleteCandidatesById(params, callback) {
    model().findOneAndDelete({ _id: params }, function (err, candidate) {
        callback(err, candidate);
    });
}

module.exports = {
    model,
    createCandidate,
    getAllCandidates,
    updateCandidateStatusById,
    updateCandidateById,
    deleteCandidatesById,
};
