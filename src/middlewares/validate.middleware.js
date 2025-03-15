import {validationResult} from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path, // Rename `path` to `field`
      message: err.msg // Keep only `msg`
    }));

    return res.status(400).json({ errors: formattedErrors });

  }

  next();
};

export default validate;