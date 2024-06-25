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
        active
        deregister {
          date
          reason
        }
      }
    }
  }
`

export const GET_STUDENT = gql`
  query GetStudent($studentId: ID!) {
    getStudent(studentId: $studentId) {
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
      deregister {
        date
        reason
      }
    }
  }
`;

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

export const UPDATE_STUDENT = gql`
  mutation EditStudent($studentId: ID!, $input: StudentInput!) {
    editStudent(studentId: $studentId, input: $input)
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($studentId: ID!, $reason: String) {
    deleteStudent(studentId: $studentId, reason: $reason)
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
