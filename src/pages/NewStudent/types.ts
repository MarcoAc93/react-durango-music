export type Course = {
  name: string;
  profesor: string;
  time: string;
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
  period: string
  amount: string;
};