import { CoursePath } from '@/components/course/course-path';
import { getCourseData } from '@/lib/course-data';

export default async function Home() {
  const courseData = await getCourseData();

  return <CoursePath modules={courseData.modules} />;
}
