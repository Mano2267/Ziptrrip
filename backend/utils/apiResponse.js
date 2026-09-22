/**
 * utils/apiResponse.js
 * Centralized response shape builders so every endpoint is consistent.
 */

/**
 * Send a 200/201 success response.
 * @param {import('express').Response} res
 * @param {*}      data     Payload to send in `data` field
 * @param {string} [message]
 * @param {number} [status=200]
 */
export function sendSuccess(res, data, message = undefined, status = 200) {
  const body = { success: true };
  if (message)              body.message = message;
  if (Array.isArray(data))  body.count = data.length;
  body.data = data;
  return res.status(status).json(body);
}

/**
 * Send a 4xx/5xx error response.
 * @param {import('express').Response} res
 * @param {string|string[]} error  Single message or array of messages
 * @param {number} [status=400]
 */
export function sendError(res, error, status = 400) {
  return res.status(status).json({
    success: false,
    error: Array.isArray(error) ? error : error
  });
}

/**
 * 404 helper.
 * @param {import('express').Response} res
 * @param {string} [msg='Resource not found']
 */
export function sendNotFound(res, msg = 'Resource not found') {
  return sendError(res, msg, 404);
}
