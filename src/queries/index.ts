import { gql } from "@apollo/client";

export const AUTH_USER = gql`
  query AuthUser($input: AuthInput!) {
    authUser(input: $input) {
      token
    }
  }
`;

export const AUTHORIZATION = gql`
  query Authorization($token: String!) {
    authorization(token: $token) {
      email
      id
      lastName
      name
    }
  }
`;

export const GET_STUDENTS = gql`
  query GetStudents {
    getStudents {
      code
      message
      success
      students {
        age
        cellphone
        email
        id
        lastName
        name
        tutor {
          cellphone
          name
        }
      }
    }
  }
`

export const CREATE_STUDENT = gql`
  mutation CreateStudent($input: StudentInput!) {
    createStudent(input: $input) {
      code
      message
      success
      student {
        age
        cellphone
        email
        id
        lastName
        name
        tutor {
          cellphone
          name
        }
      }
    }
  }
`;

export const ENROLL_STUDENT = gql`
  mutation EnrollStudent($input: EnrollStudentInput!) {
    enrollStudent(input: $input) {
      code
      message
      success
      enrollment {
        id
        payed
        period
        scholarship
        studentId
        amount
        courses {
          time
          profesor
          name
          days
        }
      }
    }
  }
`;
