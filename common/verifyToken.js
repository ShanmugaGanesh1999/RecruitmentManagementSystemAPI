var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
var config = require("config");
var utils = require("../common/utils");
var blacklistModel = require("../model/blacklistModel");

function verifyToken(req, res, next) {
  try {
    const accessToken = req.headers["x-access-token"];
    if (!accessToken) {
      res.status(403).json({
        message: "No access token",
      });
    } else {
      utils
        .verifyJwtToken(accessToken)
        .then((data) => {
          blacklistModel
            .model()
            .find({ accessToken: accessToken })
            .then(function (result) {
              if (result.length == 0) {
                req.email = data.email;
                req.role = data.role;
                next();
              } else {
                res.status(401).json({
                  message:
                    "Team member has logged out. Please login to access the functionalities",
                  data: accessToken,
                });
              }
            });
        })
        .catch((error) => {
          res.status(401).json({
            message: "Invalid Token ",
            data: error,
          });
        });
    }
  } catch (error) {
    res.status(401).json({
      message: "Token verification failed ",
      data: error,
    });
  }
}

module.exports = { verifyToken };
