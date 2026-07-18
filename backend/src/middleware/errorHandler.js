const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate value",
    });
  }

  if (err.name === "CastError") {
    return res.status(404).json({
      success: false,
      message: "Resource not found",
    });
  }

  if (err.message && err.message.includes("AI generation failed")) {
    if (err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({
        success: false,
        message: "AI service quota exceeded. Please try again in a minute.",
      });
    }
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;