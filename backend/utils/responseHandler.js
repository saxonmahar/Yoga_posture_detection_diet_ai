class ResponseHandler {
  /**
   * Success response
   */
  static success(res, message = 'Success', data = null, statusCode = 200) {
    const response = {
      success: true,
      message: message,
      timestamp: new Date().toISOString()
    };

    if (data !== null) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Error response
   */
  static error(res, message = 'Error', errors = null, statusCode = 400) {
    const response = {
      success: false,
      message: message,
      timestamp: new Date().toISOString()
    };

    if (errors !== null) {
      response.errors = Array.isArray(errors) ? errors : [errors];
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Server error response
   */
  static serverError(res, error, statusCode = 500) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return res.status(statusCode).json({
      success: false,
      message: 'Internal Server Error',
      error: isDevelopment ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Not found response
   */
  static notFound(res, resource = 'Resource') {
    return res.status(404).json({
      success: false,
      message: \\ not found\,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Unauthorized response
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return res.status(401).json({
      success: false,
      message: message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ResponseHandler;
