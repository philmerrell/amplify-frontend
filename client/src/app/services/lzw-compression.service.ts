import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LzwCompressionService {
  public lzwCompress(input: string): number[] {
    if (!input) return [];

    const dictionary = new Map<string, number>();
    const output: number[] = [];
    let nextCode = 256;

    // Initialize the dictionary with single-character keys
    for (let i = 0; i < 256; i++) {
      dictionary.set(String.fromCharCode(i), i);
    }

    let currentPattern = '';
    for (const char of input) {
      const newPattern = currentPattern + char;
      const existingCode = dictionary.get(newPattern);

      if (existingCode !== undefined) {
        currentPattern = newPattern;
      } else {
        output.push(dictionary.get(currentPattern)!);
        dictionary.set(newPattern, nextCode++);
        currentPattern = char;
      }
    }

    // Output the code for the last pattern
    if (currentPattern) {
      output.push(dictionary.get(currentPattern)!);
    }

    return output;
  }

  public lzwUncompress(compressedData: number[]): string {
    if (compressedData.length === 0) return '';

    const dictionary = new Map<number, string>();
    for (let i = 0; i < 256; i++) {
      dictionary.set(i, String.fromCharCode(i));
    }

    let decompressedString = '';
    let previousEntry = dictionary.get(compressedData[0]);
    if (!previousEntry) {
      throw new Error(
        'Invalid compressed data: First entry not found in dictionary'
      );
    }
    decompressedString += previousEntry;

    let nextCode = 256;
    for (let i = 1; i < compressedData.length; i++) {
      const currentCode = compressedData[i];
      let currentEntry = dictionary.get(currentCode);

      if (currentEntry === undefined) {
        if (currentCode === nextCode) {
          currentEntry = previousEntry + previousEntry.charAt(0);
        } else {
          throw new Error('Invalid compressed data: Entry for code not found');
        }
      }

      decompressedString += currentEntry;
      dictionary.set(nextCode++, previousEntry + currentEntry.charAt(0));
      previousEntry = currentEntry;
    }

    return decompressedString;
  }
}
