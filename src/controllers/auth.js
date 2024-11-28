"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
// Auth Controller:

const { promisify } = require("util");
const User = require("../models/user");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Login"
        #swagger.description = "Login with username (or email) and password to get an access token and refresh token."
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            description: "User credentials for login",
            schema: {
                userName: "testUser",
                email: "test@example.com",
                password: "aA?123456"
            }
        }
        #swagger.responses[200] = {
            description: "Login successful",
            schema: {
                error: false,
                bearer: {
                    access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    refresh: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                }
            }
        }
        #swagger.responses[401] = {
            description: "Unauthorized - Incorrect credentials or inactive account",
            schema: {
                error: true,
                message: "Incorrect Credentials!"
            }
        }
        #swagger.responses[400] = {
            description: "Bad Request - Missing required fields",
            schema: {
                error: true,
                message: "Username / Email and Password required!"
            }
        }
    */
    const { userName, email, password } = req.body;

    if (!((userName || email) && password)) {
      res.errorStatusCode = 400; // Changed from 401 to 400, as it's a missing field error
      throw new Error("Username / Email and Password required!");
    }

    const user = await User.findOne({ $or: [{ userName }, { email }] });

    if (!user || user.password !== passwordEncrypt(password)) {
      res.errorStatusCode = 401;
      throw new Error("Incorrect Credentials!");
    }

    if (!user.isActive) {
      res.errorStatusCode = 401;
      throw new Error("This account is not active.");
    }

    // Access Token Oluşturma
    const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_KEY, {
      expiresIn: "30m",
    });

    // Refresh Token Oluşturma
    const refreshToken = jwt.sign(
      { _id: user._id, password: user.password },
      process.env.REFRESH_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).send({
      error: false,
      bearer: {
        access: accessToken,
        refresh: refreshToken,
      },
    });
  },

  refresh: async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Refresh"
        #swagger.description = "Refresh access token using the refresh token."
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            description: "Refresh token data for refresh",
            schema: {
                refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
        #swagger.responses[200] = {
            description: "Access token refreshed successfully",
            schema: {
                error: false,
                bearer: {
                    access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                }
            }
        }
        #swagger.responses[401] = {
            description: "Unauthorized - Invalid or missing refresh token",
            schema: {
                error: true,
                message: "Invalid refresh token."
            }
        }
    */
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.errorStatusCode = 401;
      throw new Error("Refresh token is required.");
    }

    let refreshData;
    try {
      refreshData = await promisify(jwt.verify)(refreshToken, process.env.REFRESH_KEY);
    } catch (err) {
      res.errorStatusCode = 401;
      throw new Error("Invalid refresh token.");
    }

    const user = await User.findOne({ _id: refreshData._id });

    if (!(user && user.password === refreshData.password)) {
      res.errorStatusCode = 401;
      throw new Error("Wrong ID or password.");
    }

    if (!user.isActive) {
      res.errorStatusCode = 401;
      throw new Error("This account is not active.");
    }

    const newAccessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_KEY, {
      expiresIn: "30m",
    });

    res.status(200).send({
      error: false,
      bearer: {
        access: newAccessToken,
      },
    });
  },

  logout: async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Logout"
        #swagger.description = "Logs out the user. For JWT, no server-side process is required; tokens simply expire on their own."
        #swagger.responses[200] = {
            description: "Logout successful",
            schema: {
                error: false,
                message: "JWT: No need any process for logout."
            }
        }
    */
    res.status(200).send({
      error: false,
      message: "JWT: No need any process for logout.",
    });
  },
};
