export interface HandwritingFeedback {
  grade: number; // 1-10
  critique: string;
  improvements: string[];
  encouragement: string;
}

export enum Difficulty {
  Beginner = 'Beginner', // Single letters
  Intermediate = 'Intermediate', // Short words
  Advanced = 'Advanced', // Sentences
}

export interface PracticeTarget {
  text: string;
  hint: string;
}