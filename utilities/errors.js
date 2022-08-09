const typeObjectError = (parameterValue, parameterName = "") => {
  if (
    typeof parameterValue !== "object" ||
    Array.isArray(parameterValue) ||
    parameterValue === null
  ) throw new Error(`Markdown-it-eleventy-img: \`${parameterName}\` needs to be an \`object\`.`);
}

const typeFunctionError = (parameterValue, parameterName = "") => {
  if(typeof parameterValue !== "function") throw new Error(`Markdown-it-eleventy-img: \`${parameterName}\` needs to be a \`function\`.`);
}

module.exports = {
  typeObjectError,
  typeFunctionError
}