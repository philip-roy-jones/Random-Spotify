import characterRanges from '../characterRanges.json';

export default function generateRandomString(length: number): string {
  const randomScriptPosition = Math.floor(Math.random() * characterRanges.length);
  const script = characterRanges[randomScriptPosition];
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomRangePosition = Math.floor(Math.random() * script.ranges.length);
    const lowerBound = parseInt(script.ranges[randomRangePosition][0], 16);
    const upperBound = parseInt(script.ranges[randomRangePosition][1], 16);

    result += String.fromCharCode(Math.floor(Math.random() * (upperBound - lowerBound)) + lowerBound);
  }

  result = sanitizeInput(result);

  if (!result) generateRandomString(length);
  return result;
}

// Ensures the input is valid UTF-8
function sanitizeInput(input: string): string {
  try {
    // Normalize the input and encode to ensure it's valid UTF-8
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const utf8 = encoder.encode(input);
    return decoder.decode(utf8);
  } catch (error) {
    console.error("Failed to encode the input:", error);
    return '';
  }
}