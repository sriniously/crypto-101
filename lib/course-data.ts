import { promises as fs } from 'fs';
import path from 'path';

export interface Lesson {
  id: string;
  number: string;
  title: string;
  description: string;
  duration: number;
  objectives: string[];
  simulations?: Array<{
    id: string;
    title: string;
    component: string;
    description: string;
  }>;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  track: string;
  objectives: string[];
  duration: number;
  prerequisites: string[];
  lessons: Lesson[];
}

export interface CourseData {
  modules: Module[];
}

export async function getCourseData(): Promise<CourseData> {
  const modulesDir = path.join(process.cwd(), 'content/modules');

  try {
    const moduleDirectories = await fs.readdir(modulesDir, {
      withFileTypes: true,
    });
    const modules: Module[] = [];

    for (const dir of moduleDirectories) {
      if (dir.isDirectory()) {
        const metaPath = path.join(modulesDir, dir.name, 'meta.json');

        try {
          const metaContent = await fs.readFile(metaPath, 'utf-8');
          const moduleData = JSON.parse(metaContent) as Module;
          modules.push(moduleData);
        } catch (error) {
          console.warn(`Could not read meta.json for ${dir.name}:`, error);
        }
      }
    }

    modules.sort((a, b) => a.number - b.number);

    return { modules };
  } catch (error) {
    console.error('Error loading course data:', error);
    return { modules: [] };
  }
}
