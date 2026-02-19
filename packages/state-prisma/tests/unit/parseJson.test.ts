import { describe, it, expect } from 'vitest';
import { parseJson } from '../../src/utils/parseJson.js';

describe('parseJson', () => {
  it('should return an object as-is', () => {
    const obj = { key: 'value' };
    expect(parseJson(obj)).toBe(obj);
  });

  it('should parse a JSON string to an object', () => {
    expect(parseJson('{"key":"value"}')).toEqual({ key: 'value' });
  });

  it('should parse a JSON array string', () => {
    expect(parseJson('[1,2,3]')).toEqual([1, 2, 3]);
  });

  it('should return an array as-is', () => {
    const arr = [1, 2, 3];
    expect(parseJson(arr)).toBe(arr);
  });

  it('should return null as-is', () => {
    expect(parseJson(null)).toBeNull();
  });

  it('should return a number as-is', () => {
    expect(parseJson(42)).toBe(42);
  });
});
