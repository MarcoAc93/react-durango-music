import { daysToSpanish } from "../pages/NewStudent/constants";
import { Course } from "../pages/NewStudent/types";

// @ts-ignore
export const generateCourseString = (courseInfo: Course) => `Curso de ${courseInfo.name} con ${courseInfo.profesor} a las ${courseInfo.time} los dias ${courseInfo.days?.map(el => daysToSpanish[el]).join(', ')}`;
