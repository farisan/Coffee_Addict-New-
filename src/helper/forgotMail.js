const nodemailer = require("nodemailer");
const { google } = require("googleapis");
// const fs = require("fs");
const { readFileSync } = require("fs");
const mustache = require("mustache");
const path = require("path");

const clientId = process.env.MAIL_CLIENT_ID;
const clientSecret = process.env.MAIL_CLIENT_SECRET;
const refreshToken = process.env.MAIL_REFRESH_TOKEN;

const { OAuth2 } = google.auth;
const OAuth2Client = new OAuth2(
  clientId,
  clientSecret,
  "https://developers.google.com/oauthplayground"
);
OAuth2Client.setCredentials({
  refresh_token: refreshToken,
});

module.exports = {
  forgotMail: (data) =>
    new Promise((resolve, reject) => {
      const accessToken = OAuth2Client.getAccessToken;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "Muhammad.farisan99@gmail.com",
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });

      const fileTemplate = readFileSync(
        path.join(__dirname, "..", "templates", "email", `${data.template}`),
        "utf8"
      );

      console.log(fileTemplate);

      const mailOptions = {
        from: '"Coffee Addict" <muhammad.farisan99@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    }),
};