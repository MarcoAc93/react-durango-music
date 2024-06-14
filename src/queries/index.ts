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
        deregister {
          comment
          date
        }
        enrollment {
          amount
          id
          payed
          period
          scholarship
          studentId
          courses {
            days {
              friday
              monday
              saturday
              sunday
              thursday
              tuesday
              wednesday
            }
            name
            profesor
            time
          }
        }
        id
        lastName
        name
        tutor {
          contactNumber
          name
        }
      }
    }
  }
`
