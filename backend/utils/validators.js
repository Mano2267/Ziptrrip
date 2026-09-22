/**
 * utils/validators.js
 * Pure validation helpers – no framework deps, easy to unit-test.
 */

const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Validate a todo title.
 * @param {*} title
 * @returns {string|null}  Error message or null if valid.
 */
export function validateTitle(title) {
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return 'Title is required and must be a non-empty string';
  }
  if (title.trim().length > 200) {
    return 'Title must be 200 characters or less';
  }
  return null;
}

/**
 * Validate a priority value.
 * @param {*} priority
 * @returns {string|null}
 */
export function validatePriority(priority) {
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
  }
  return null;
}

/**
 * Validate tags array.
 * @param {*} tags
 * @returns {string|null}
 */
export function validateTags(tags) {
  if (tags === undefined || tags === null) return null; // optional
  if (!Array.isArray(tags)) return 'tags must be an array of strings';
  if (tags.some(t => typeof t !== 'string')) return 'Each tag must be a string';
  return null;
}

/**
 * Run all validations for a create payload.
 * @param {{ title, priority, tags }} body
 * @returns {string[]} Array of error messages (empty = valid)
 */
export function validateCreatePayload({ title, priority, tags }) {
  return [
    validateTitle(title),
    validatePriority(priority),
    validateTags(tags)
  ].filter(Boolean);
}

/**
 * Run all validations for an update payload (all fields optional).
 * @param {{ title, priority, tags }} body
 * @returns {string[]}
 */
export function validateUpdatePayload({ title, priority, tags }) {
  const errors = [];
  if (title !== undefined) {
    const e = validateTitle(title);
    if (e) errors.push(e);
  }
  if (priority !== undefined) {
    const e = validatePriority(priority);
    if (e) errors.push(e);
  }
  if (tags !== undefined) {
    const e = validateTags(tags);
    if (e) errors.push(e);
  }
  return errors;
}
