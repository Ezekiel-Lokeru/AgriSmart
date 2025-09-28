/**
 * @function errorHandler
 * @description Error handler middleware for capturing all errors and sends a response to the user
 * @param {Object} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param _next - Next middleware function
 * @returns {Object} - Returns a response object
 *
 */
const errorHandler = (err, req, res, _next) => {
	// Set the status code to the error status or 500
	const errorStatus = err.status || 500;
	
	let errorMessage = err.message;
	let stackMessage = err.stack;
	
	const response = {
		success: false,
		error: true,
		message: errorMessage,
		stack: stackMessage
	};
	
	return res.status(errorStatus).json(response);
}

/**
 * @function badGateway
 * @description Error handler middleware for capturing all errors and sends a response to the user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Returns render 502 page
 */
const badGateway = (req, res) => {
	return res.status(502).json({
		success: false,
		error: true,
		message: "Bad Gateway"
	});
}

/**
 * Not found middleware - Captures all requests to unknown routes
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} _next - Next middleware function
 * @returns {Object} - Returns a response object
 */
const notFound = (req, res, _next) => {
	// Check if the url start with "/api/"
	return res.status(404).json({
		success: false,
		error: true,
		message: "Resource not found!"
	});
}

/**
 * Exporting the error handler and not found middleware
 */
module.exports = {
	errorHandler, notFound, badGateway
}