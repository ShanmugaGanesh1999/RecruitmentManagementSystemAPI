var mongoose = require("mongoose");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var blacklistSchema = new Schema({
    id: ObjectId,
    accessToken: String,
    createdDateTime: {
        type: Date,
        default: Date.now(),
    },
});

const blacklistModel = mongoose.model("blacklist", blacklistSchema);

function model() {
    return blacklistModel;
}
function saveAccessToken(accessToken, callback) {
    model().find(
        {
            accessToken: accessToken,
        },
        function (error, data) {
            if (data.length <= 0) {
                model().create(
                    {
                        accessToken: accessToken,
                    },
                    function (err, tokenData) {
                        return callback(err, tokenData);
                    }
                );
            } else {
                model().findOneAndUpdate(
                    {
                        accessToken: accessToken,
                    },
                    {
                        accessToken: accessToken,
                    },
                    { new: true },
                    function (err, user) {
                        return callback(err, user);
                    }
                );
            }
        }
    );
}
module.exports = { model, saveAccessToken };
