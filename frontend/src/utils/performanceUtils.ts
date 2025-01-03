export function measureExecutionTime<T>(fn: (...args: unknown[]) => T): (...args: unknown[]) => Promise<T> {  return async (...args: unknown[]): Promise<T> => {
    const startTime = performance.now();
    const result = await fn(...args);
    const endTime = performance.now();
    console.log(`Execution time: ${endTime - startTime} milliseconds`);
    return result;
  };
}