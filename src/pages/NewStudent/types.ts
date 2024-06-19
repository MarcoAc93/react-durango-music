export enum Time {
  FIVE_TO_SIX = '5pm - 6pm',
  SIX_TO_SEVEN = '6pm - 7pm',
  SEVEN_TO_EIGHT = '7pm - 8pm',
  EIGHT_TO_NINE = '8pm - 9pm'
}

export type Course = {
  name: string;
  profesor: string;
  time: Time
  days: string[];
}

export type FormValues = {
  name: string,
  lastName: string,
  email: string,
  cellphone: string,
  age: string,
  tutorName: string,
  tutorContactNumber: string,
  course: string, // Temp field for adding new course
  profesor: string, // Temp field for adding new course
  time: string, // Temp field for adding new course
  days: string[], // Temp field for adding new course
  courses: [Course];
};