var mongoose = require("mongoose");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const interviewerSchema = new Schema({
    id: ObjectId,
    name: String,
    emailId: String,
    password: String,
});

const interviewerModel = mongoose.model("interviewer", interviewerSchema);

function model() {
    return interviewerModel;
}

function resetPassword(params, callback) {
    model().findOneAndUpdate(
        { emailId: params.emailId, password: params.oldPassword },
        {
            $set: {
                password: params.newPassword,
            },
        },
        { new: true },
        (err, res) => {
            callback(err, res);
        },
    );
}

function createInterviewer(params) {
    return model().create(params);
}

function getAllInterviewers() {
    return new Promise((response, reject) => {
        model().find({}, function (err, data) {
            if (data) {
                response(data);
            } else {
                reject(err);
            }
        });
    });
}

function getInterviewerById(id) {
    return new Promise((response, reject) => {
        model().find({ _id: id }, function (err, data) {
            if (data) {
                response(data);
            } else {
                reject(err);
            }
        });
    });
}

function updateInterviewerById(params, callback) {
    model().findOneAndUpdate(
        { _id: params.id },
        {
            $set: {
                name: params.name,
                emailId: params.emailId,
                password: params.password,
            },
        },
        { new: true },
        function (error, interviewer) {
            if (interviewer) {
                callback(null, interviewer);
            } else {
                callback("Can't update", null);
            }
        },
    );
}

function deleteInterviewerById(id, callback) {
    model().findOneAndDelete({ _id: id }, function (err, interviewer) {
        callback(err, interviewer);
    });
}

function resetPwd(email, pwd, callback) {
    model().findOneAndUpdate(
        { emailId: email },
        {
            $set: {
                password: pwd,
            },
        },
        { new: true },
        function (err, interviewer) {
            callback(err, interviewer);
        },
    );
}
module.exports = {
    model,
    resetPassword,
    resetPwd,
    createInterviewer,
    getAllInterviewers,
    getInterviewerById,
    updateInterviewerById,
    deleteInterviewerById,
};
