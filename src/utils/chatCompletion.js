const chatCompletion = require("./openai");

module.exports = async function getResponse(prompt) {
  return await chatCompletion({
    prompt: prompt.message,
    systemMsg: "You are a helpful assistant",
  });
};
