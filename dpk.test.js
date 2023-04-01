const { deterministicPartitionKey } = require('./dpk');

describe('deterministicPartitionKey', () => {
  test('should return trivial partition key when no event is provided', () => {
    expect(deterministicPartitionKey()).toBe('0');
  });

  test('should return partitionKey from the event object when provided', () => {
    const event = { partitionKey: 'my-partition-key' };
    expect(deterministicPartitionKey(event)).toBe('my-partition-key');
  });

  test('should return a hashed partition key when no partitionKey is provided in the event object', () => {
    const event = { data: 'example data' };
    const result = deterministicPartitionKey(event);
    expect(typeof result).toBe('string');
    expect(result.length).toBe(128);
  });

  test('should hash a partitionKey longer than the max allowed length', () => {
    const event = { partitionKey: 'a'.repeat(257) };
    const result = deterministicPartitionKey(event);
    expect(typeof result).toBe('string');
    expect(result.length).toBe(128);
  });

  test('should hash a non string partitionKey', () => {
    const event = { partitionKey: 1 };
    const result = deterministicPartitionKey(event);
    expect(typeof result).toBe('string');
  });
});