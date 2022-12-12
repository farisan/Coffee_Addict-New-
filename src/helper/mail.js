const fs = require("fs");
const mustache = require("mustache");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const path = require("path");
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
const user = process.env.GOOGLE_CLIENT_USER;

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
  mailSender: (data) => {
    return new Promise((resolve, reject) => {
      const accessToken = OAuth2Client.getAccessToken;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: user,
          clientId: clientId,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
          accessToken,
        },
      });

      const template = fs.readFileSync(
        path.join(__dirname, "..", "templates", "email", `${data.template}`),
        "utf-8"
      );
      // console.log(template);

      const mailOption = {
        from: '"Coffebug" <fcb.nyak@gmail.com>',
        to: data.to,
        subject: data.subject,
        html: mustache.render(template, { ...data }),
      };

      transporter.sendMail(mailOption, (err, info) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        return resolve({
          status: 200,
          msg: "Success, check email to verify",
        });
      });
    });
  },
};