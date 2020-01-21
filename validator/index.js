exports.userSignupValidator = (req, res, next) => {
  req.check("name", "Name cannot be empty").notEmpty();
  req
    .check("email", "Email must contain at least 6 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 6,
      max: 32
    })
    .withMessage("Email min length must be up to 6 and max 32");
  req.check("password", "Password is required").notEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number");
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};
