const OpenAI = require("openai");
const { queue } = require("async");
const { envKeys } = require("../../config");

const openai = new OpenAI({
  apiKey: envKeys.openAIKey,
});

// Variables for exponential backoff
const baseRetryDelay = 1000; // Initial delay in ms (1 second)
const maxRetryDelay = 32000; // Maximum delay in ms (32 seconds)
let retryDelay = baseRetryDelay; // Current delay, will be adjusted on retry

const requestQueue = queue(async (task) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: task.systemMsg },
        { role: "user", content: task.prompt },
      ],
    });
    // Reset retry delay on success
    retryDelay = baseRetryDelay;
    // Resolve the task's promise
    task.resolve(response.choices[0].message.content);
  } catch (error) {
    console.error("Error processing request:", error);
    if (error.response && error.response.headers) {
      adjustRateLimitingBasedOnHeaders(error.response.headers);
    }
    // Adjust for retry
    retryTask(task);
  }
}, 1);

function retryTask(task) {
  setTimeout(() => {
    retryDelay = Math.min(retryDelay * 2, maxRetryDelay);
    requestQueue.push(task);
  }, retryDelay);
}

module.exports = function chatCompletion({ prompt, systemMsg }) {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    requestQueue.push({
      prompt,
      systemMsg,
      resolve, // Pass the resolve function directly
      reject, // Pass the reject function directly
    });
  });
};

function adjustRateLimitingBasedOnHeaders(headers) {
  // Extract rate limit headers
  console.log(`Rate limit will reset at ${headers["x-ratelimit-reset"]}`);

  const remaining = parseInt(headers["x-ratelimit-remaining"], 10);
  const reset = parseInt(headers["x-ratelimit-reset"], 10); // Unix timestamp when the rate limit resets
  const limit = parseInt(headers["x-ratelimit-limit"], 10); // Total number of requests allowed in the current window

  // Current time in Unix timestamp
  const now = Math.floor(Date.now() / 1000);

  // Calculate time until rate limit reset
  const timeUntilReset = reset - now;

  if (remaining === 0 && timeUntilReset > 0) {
    // If no more requests are allowed, set retryDelay to the time until reset plus some jitter
    retryDelay = (timeUntilReset + Math.random()) * 1000; // Convert to milliseconds and add jitter
  } else if (limit && remaining <= limit * 0.1) {
    // If remaining requests are less than 10% of the limit
    // Increase delay to spread out requests, adding jitter
    retryDelay = Math.min(maxRetryDelay, retryDelay * 2 + Math.random() * 1000);
  } else {
    // Reset or adjust retryDelay based on normal operations, including a small amount of jitter to prevent synchronized retries
    retryDelay = baseRetryDelay + Math.random() * 100;
  }
}
