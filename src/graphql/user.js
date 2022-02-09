export const CREATE_USER_MUTATION = `
  mutation createUser(
    $email: String!
    $name: String!
    $roles: [Role]!
    $identityId: String!
  ) {
    createUser(
      data: {
        email: $email
        name: $name
        roles: $roles
        identityId: $identityId
      }
    ) {
      _id
      email
      name
      roles
      identityId
    }
  }
`;

export const REGISTER_USER_MUTATION = `
  mutation register(
    $credentials: UserCredentials!
    $user: UserRegisterInput!
  ) {
    register(
      credentials: $credentials,
      user: $user
    ) {
      _id
      email
      name
      roles
    }
  }
`;

export const RESET_USER_PASSWORD_MUTATION = `
  mutation resetPassword(
  	$userId: ID!
    $credentials: UserCredentials!
  ) {
    resetPassword(
      userId: $userId,
      credentials: $credentials
    ) {
      _id
      email
      name
      roles
    }
  }
`;

export const CHECK_CREDENTIALS_MUTATION = `
  query checkCredentials(
  	$userId: ID!
    $password: String!
  ) {
    checkCredentials(
      userId: $userId,
      password: $password
    )
  }
`;

export const USER_LOGOUT_MUTATION = `
  mutation logout($allTokens: Boolean!) {
    logout(allTokens: $allTokens)
  }
`;

export const USER_LOGIN_MUTATION = `
  mutation login(
    $email: String!
    $password: String!
  ) {
    login(email: $email, password: $password) {
      secret
      user {
      	_id
      	email
      	name
      	roles
      }
    }
  }
`;

export const USER_BY_EMAIL_QUERY = `
  query userByEmail($email: String!) {
    userByEmail(email: $email) {
      _id
      email
      name
      identityId
      roles
    }
  }
`;

export const ALL_USERS_QUERY = `
  query allUsers {
    allUsers {
      data {
        _id
        email
        name
        identityId
        roles
      }
    }
  }
`;
