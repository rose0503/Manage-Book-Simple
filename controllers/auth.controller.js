//const md5 = require("md5");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../db.js");
const shortid = require("shortid");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.login = (req, res) => {
  res.render("auth/login");
};

module.exports.postLogin = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  var user = db
    .get("users")
    .find({ email: email })
    .value();

  if (!user) {
    res.render("auth/login", {
      errors: ["Email is not exist."],
      values: req.body
    });
    return;
  }

  let countWrongPassword = user.wrongLoginCount;
  if (countWrongPassword >= 3) {
    res.render("auth/login", {
      errors: ["Bạn đã nhập sai quá nhiều lần. Hãy quay lại sau!!."],
      values: req.body
    });

    const msg = {
      to: email,
      from: "tqviet.0503@gmail.com",
      subject:
        "Enter the wrong password more than the specified number of times",
      text:
        "If you receive this email, because you have entered the wrong password more than 3 times.",
      html:
        "If you receive this email, because you have entered the wrong password more than 3 times."
    };
    sgMail.send(msg).then(
      () => {},
      error => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
  }

  //var hashedPassword = md5(password);
  const resultCheck = bcrypt.compareSync(password, user.password);

  if (resultCheck === false) {
    db.get("users")
      .find({ email: email })
      .assign({ wrongLoginCount: (countWrongPassword += 1) })
      .write();
    res.render("auth/login", {
      errors: ["Wrong password."],
      values: req.body
    });
    return;
  }

  res.cookie("userId", user.id, { signed: true });
  res.redirect("/");
};

module.exports.logout = (req, res) => {
  res.clearCookie("userId", {
    path: "/"
  });
  res.redirect("/auth/login");
};
