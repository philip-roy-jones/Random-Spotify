import characterRanges from '../characterRanges.json';

export default function randomStringGenerator(length: number): string {
  const randomScriptPosition = Math.floor(Math.random() * characterRanges.length);
  const script = characterRanges[randomScriptPosition];
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomRangePosition = Math.floor(Math.random() * script.ranges.length);
    const lowerBound = parseInt(script.ranges[randomRangePosition][0], 16);
    const upperBound = parseInt(script.ranges[randomRangePosition][1], 16);

    result += String.fromCharCode(Math.floor(Math.random() * (upperBound - lowerBound)) + lowerBound);
  }

  return result;
}