import type {
  ModuleMetadata,
  LessonMetadata,
  SimulationReference,
} from '../content/types';

export type ModuleMDX = ModuleMetadata;
export type LessonMDX = LessonMetadata;
export type SimulationMDX = SimulationReference;

import module1Meta from '../content/modules/module-1/meta.json';

export const MODULES_MDX: ModuleMDX[] = [module1Meta as ModuleMDX];

export function getModuleByIdMDX(moduleId: string): ModuleMDX | undefined {
  return MODULES_MDX.find(module => module.id === moduleId);
}

export function getLessonByIdMDX(
  moduleId: string,
  lessonId: string
): LessonMDX | undefined {
  const moduleData = getModuleByIdMDX(moduleId);
  return moduleData?.lessons?.find(lesson => lesson.id === lessonId);
}

export function getNextLessonMDX(
  moduleId: string,
  lessonId: string
): { module: ModuleMDX; lesson: LessonMDX } | null {
  const currentModule = getModuleByIdMDX(moduleId);
  if (!currentModule || !currentModule.lessons) return null;

  const currentLessonIndex = currentModule.lessons.findIndex(
    lesson => lesson.id === lessonId
  );
  if (currentLessonIndex === -1) return null;

  if (currentLessonIndex < currentModule.lessons.length - 1) {
    return {
      module: currentModule,
      lesson: currentModule.lessons[currentLessonIndex + 1],
    };
  }

  const currentModuleIndex = MODULES_MDX.findIndex(
    module => module.id === moduleId
  );
  if (currentModuleIndex < MODULES_MDX.length - 1) {
    const nextModule = MODULES_MDX[currentModuleIndex + 1];
    if (nextModule.lessons && nextModule.lessons.length > 0) {
      return {
        module: nextModule,
        lesson: nextModule.lessons[0],
      };
    }
  }

  return null;
}

export function getPreviousLessonMDX(
  moduleId: string,
  lessonId: string
): { module: ModuleMDX; lesson: LessonMDX } | null {
  const currentModule = getModuleByIdMDX(moduleId);
  if (!currentModule || !currentModule.lessons) return null;

  const currentLessonIndex = currentModule.lessons.findIndex(
    lesson => lesson.id === lessonId
  );
  if (currentLessonIndex === -1) return null;

  if (currentLessonIndex > 0) {
    return {
      module: currentModule,
      lesson: currentModule.lessons[currentLessonIndex - 1],
    };
  }

  const currentModuleIndex = MODULES_MDX.findIndex(
    module => module.id === moduleId
  );
  if (currentModuleIndex > 0) {
    const previousModule = MODULES_MDX[currentModuleIndex - 1];
    if (previousModule.lessons && previousModule.lessons.length > 0) {
      return {
        module: previousModule,
        lesson: previousModule.lessons[previousModule.lessons.length - 1],
      };
    }
  }

  return null;
}
