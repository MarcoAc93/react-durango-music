import moment from "moment";
import { PERIODS, daysToSpanish } from "../pages/NewStudent/constants";
import { Course } from "../pages/NewStudent/types";

// @ts-ignore
export const generateCourseString = (courseInfo: Course) => `Curso de ${courseInfo.name} con ${courseInfo.profesor} a las ${courseInfo.time} los dias ${courseInfo.days?.map(el => daysToSpanish[el]).join(', ')}`;

export const getPeriodsWithYear = () => {
  const currentYear = moment().year();
  const nextYear = moment().add(1, 'year').year();
  const currentMonth = moment().month() + 1; // month() is zero-indexed, so add 1

  const periodsWithYear = PERIODS.map(period => {
    if (period === 'Enero - Junio') {
      // If it's December, set the next year for the January - June period
      const year = currentMonth >= 12 ? nextYear : currentYear;
      return `${period} ${year}`;
    } else if (period === 'Julio - Diciembre') {
      // If it's November or earlier, set the current year for the July - December period
      const year = currentMonth >= 6 && currentMonth < 12 ? currentYear : nextYear;
      return `${period} ${year}`;
    }
    return period;
  });

  return periodsWithYear;
};

export const capitalizeFirstLetter = (value: string) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};
