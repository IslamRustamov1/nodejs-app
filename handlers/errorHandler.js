// Add error formatter
function formatError(error, message, statusCode) {
  return {
    statusCode,
    message
  };
}

exports.formatError = formatError;
