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
