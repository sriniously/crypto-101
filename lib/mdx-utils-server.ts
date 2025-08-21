import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { ModuleMetadata } from '../content/types';

const contentDirectory = path.join(process.cwd(), 'content');
const modulesDirectory = path.join(contentDirectory, 'modules');

export interface LessonFrontmatter {
  title: string;
  description: string;
  type: 'concept' | 'simulation' | 'demo' | 'exercise';
  objectives: string[];
  duration?: number;
  prerequisites?: string[];
  simulations?: Array<{
    id: string;
    title: string;
    component: string;
    description: string;
  }>;
  codeExamples?: Array<{
    id: string;
    title: string;
    language: string;
    description: string;
  }>;
}

export async function getModuleMeta(
  moduleId: string
): Promise<ModuleMetadata | null> {
  try {
    const metaPath = path.join(modulesDirectory, moduleId, 'meta.json');
    const metaContent = fs.readFileSync(metaPath, 'utf8');
    return JSON.parse(metaContent);
  } catch (error) {
    console.error(`Error reading module meta for ${moduleId}:`, error);
    return null;
  }
}

export type ModuleMeta = ModuleMetadata;

export async function getLessonContent(
  moduleId: string,
  lessonId: string
): Promise<{
  frontmatter: LessonFrontmatter;
  content: string;
  source: string;
} | null> {
  try {
    const lessonPath = path.join(
      modulesDirectory,
      moduleId,
      'lessons',
      `${lessonId}.mdx`
    );
    const lessonSource = fs.readFileSync(lessonPath, 'utf8');

    const { data: frontmatter, content } = matter(lessonSource);

    return {
      frontmatter: frontmatter as LessonFrontmatter,
      content,
      source: lessonSource,
    };
  } catch (error) {
    console.error(
      `Error reading lesson ${lessonId} for module ${moduleId}:`,
      error
    );
    return null;
  }
}

export async function getAllModuleIds(): Promise<string[]> {
  try {
    const entries = fs.readdirSync(modulesDirectory, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort();
  } catch (error) {
    console.error('Error reading modules directory:', error);
    return [];
  }
}

export async function getModuleLessonIds(moduleId: string): Promise<string[]> {
  try {
    const lessonsDir = path.join(modulesDirectory, moduleId, 'lessons');
    const files = fs.readdirSync(lessonsDir);
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => file.replace('.mdx', ''))
      .sort();
  } catch (error) {
    console.error(`Error reading lessons for module ${moduleId}:`, error);
    return [];
  }
}

export function validateContentStructure(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  try {
    if (!fs.existsSync(contentDirectory)) {
      errors.push('Content directory does not exist');
      return { valid: false, errors };
    }

    if (!fs.existsSync(modulesDirectory)) {
      errors.push('Modules directory does not exist');
      return { valid: false, errors };
    }

    const moduleEntries = fs.readdirSync(modulesDirectory, {
      withFileTypes: true,
    });
    const moduleIds = moduleEntries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    for (const moduleId of moduleIds) {
      const moduleDir = path.join(modulesDirectory, moduleId);

      const metaPath = path.join(moduleDir, 'meta.json');
      if (!fs.existsSync(metaPath)) {
        errors.push(`Module ${moduleId} missing meta.json`);
      }

      const lessonsDir = path.join(moduleDir, 'lessons');
      if (!fs.existsSync(lessonsDir)) {
        errors.push(`Module ${moduleId} missing lessons directory`);
        continue;
      }

      const lessonFiles = fs.readdirSync(lessonsDir);
      const mdxFiles = lessonFiles.filter(file => file.endsWith('.mdx'));

      if (mdxFiles.length === 0) {
        errors.push(`Module ${moduleId} has no lesson files`);
      }
    }
  } catch (error) {
    errors.push(`Error validating content structure: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
