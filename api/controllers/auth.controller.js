const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const saltRounds = 10;

var User = require("../../models/user.model");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.postLogin = async (req, res) => {
  try {
    var email = req.body.email;
    var password = req.body.password;

    // find user
    const user = await User.findOne({ email });

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

    let resultCheck = bcrypt.compareSync(password, user.password);
    //resultCheck = true;
    if (resultCheck === false) {
      await User.findByIdAndUpdate(user._id, {
        wrongLoginCount: (countWrongPassword += 1)
      });
      res.render("auth/login", {
        errors: ["Wrong password."],
        values: req.body
      });
      return;
    }
    return res.status(200).json({
      message: "You have successfully logged in",
      user: user
    });
  } catch ({ message = "Invalid request" }) {
    return res.status(400).json({ message });
  }
};

module.exports.logout = (req, res) => {
  try {
    res.clearCookie("userId", { path: "/" });
    res.status(200).json({ message: "Logout successfully" });
  } catch ({ message = "Invalid request" }) {
    res.status(400).json({ message });
  }
};
