export type Course = {
  name: string;
  profesor: string;
  time: string;
  days: string[];
}

export type FormValuesStudentInfo = {
  name: string,
  lastName: string,
  email: string,
  cellphone: string,
  age: string,
  tutorName: string,
  tutorContactNumber: string,
};

export type FormValuesEnrollment = {
  course: string, // Temp field for adding new course
  profesor: string, // Temp field for adding new course
  time: string, // Temp field for adding new course
  days: string[], // Temp field for adding new course
  courses: [Course];
  period: string
  amount?: string;
};

export type ModalState = {
  isOpen: boolean;
  title: string;
  description: string;
};
