const crypto = require("crypto");

// Create a SHA3-512 hash of the given data and return the hex representation
const createHash = (data) => crypto.createHash("sha3-512").update(data).digest("hex");

// Ensure the given candidate is a string; if not, convert it to a JSON string
const ensureString = (candidate) => typeof candidate !== "string" ? JSON.stringify(candidate) : candidate;

// Truncate the given candidate if its length exceeds maxLength by creating a hash
const truncateKey = (candidate, maxLength) => candidate.length > maxLength ? createHash(candidate) : candidate;

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  // If a partition key is provided in the event object, use it as the candidate; otherwise, create a hash from the event data
  const candidate = event.partitionKey
    ? event.partitionKey
    : createHash(JSON.stringify(event));

  const stringCandidate = ensureString(candidate);

  const truncatedCandidate = truncateKey(stringCandidate, MAX_PARTITION_KEY_LENGTH);

  return truncatedCandidate;
};