export interface CodeExample {
  id?: string;
  title: string;
  description?: string;
  explanation?: string;
  language: string;
  code: string;
  runnable?: boolean;
}

export interface LessonContentData {
  markdown: string;
  codeExamples?: CodeExample[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: {
    id: string;
    text: string;
    correct?: boolean;
  }[];
  explanation?: string;
  hint?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export type {
  ModuleMetadata,
  LessonMetadata,
  SimulationReference,
} from '../content/types';
