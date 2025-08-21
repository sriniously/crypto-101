export interface ModuleMetadata {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  track: 'foundation' | 'defi' | 'dapp';
  objectives: string[];
  duration: number;
  prerequisites: string[];
  lessons: LessonMetadata[];
}

export interface LessonMetadata {
  id: string;
  number: string;
  title: string;
  description: string;
  duration: number;
  objectives: string[];
  simulations?: SimulationReference[];
}

export interface SimulationReference {
  id: string;
  title: string;
  component: string;
  description: string;
  config?: Record<string, any>;
}

export interface SimulationConfig {
  id: string;
  title: string;
  description: string;
  component: string;
  category: 'foundation' | 'defi' | 'dapp' | 'security' | 'governance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  objectives: string[];
  prerequisites?: string[];
  parameters?: Record<string, any>;
  validation?: {
    required: boolean;
    criteria: string[];
  };
}

export interface AssessmentQuestion {
  id: string;
  type: 'single' | 'multiple' | 'drag-drop' | 'fill-in' | 'simulation';
  question: string;
  options?: {
    id: string;
    text: string;
    correct?: boolean;
  }[];
  correctAnswer?: string | string[];
  explanation: string;
  hint?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ModuleAssessment {
  moduleId: string;
  title: string;
  description: string;
  passingScore: number;
  maxAttempts: number;
  timeLimit?: number;
  questions: AssessmentQuestion[];
  simulationTasks?: SimulationTask[];
}

export interface SimulationTask {
  id: string;
  simulationId: string;
  title: string;
  description: string;
  objectives: string[];
  completionCriteria: string[];
  points: number;
}

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  explanation?: string;
  runnable?: boolean;
  testCases?: TestCase[];
}

export interface TestCase {
  id: string;
  description: string;
  input?: any;
  expectedOutput?: any;
  explanation?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'simulation' | 'assessment' | 'completion';
  requirements: {
    type:
      | 'module-complete'
      | 'assessment-score'
      | 'simulation-complete'
      | 'streak';
    target: string | number;
    count?: number;
  }[];
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface ProgressData {
  userId: string;
  moduleProgress: {
    [moduleId: string]: {
      status: 'not-started' | 'in-progress' | 'completed';
      lessonsCompleted: string[];
      simulationsCompleted: string[];
      assessmentScore?: number;
      completedAt?: Date;
    };
  };
  achievements: string[];
  totalPoints: number;
  streak: number;
  lastActivity: Date;
}

export interface ContentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ContentStructure {
  modules: ModuleMetadata[];
  simulations: SimulationConfig[];
  achievements: Achievement[];
}
