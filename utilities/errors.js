/**
 * Throws an error if `parameterValue` is not an object.
 * @param {any} parameterValue Parameter to test.
 * @param {string} parameterName Identifies parameter in error message.
 */
const typeObjectError = (parameterValue, parameterName = "") => {
  if (
    typeof parameterValue !== "object" ||
    Array.isArray(parameterValue) ||
    parameterValue === null
  ) throw new Error(`Markdown-it-eleventy-img: \`${parameterName}\` needs to be an \`object\`.`);
};

/**
 * Throws an error if `parameterValue` is not a function.
 * @param {any} parameterValue Parameter to test.
 * @param {string} parameterName Identifies parameter in error message.
 */
const typeFunctionError = (parameterValue, parameterName = "") => {
  if(
    typeof parameterValue !== "function" &&
    parameterValue !== undefined
  ) throw new Error(`Markdown-it-eleventy-img: \`${parameterName}\` needs to be a \`function\`.`);
};

module.exports = {
  typeObjectError,
  typeFunctionError
};