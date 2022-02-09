import gql from 'graphql-tag';

export const CREATE_DEFAULT_BOARD_MUTATION = `
  mutation createBoard(
    $title: String!
    $description: String!
    $userId: ID!
    $columns: [ColumnInput]!
  ) {
    createBoard(
      data: {
        title: $title
        description: $description
        user: { connect: $userId }
        columns: { create: $columns }
      }
    ) {
      _id
      title
      description
      columns {
        data {
          _id
          title
        }
      }
    }
  }
`;
export const EMPTY_UPDATE_BOARD_MUTATION = gql`
    mutation emptyUpdateBoard($boardId: ID!) {
        emptyUpdateBoard(boardId: $boardId) {
            _id
        }
    }
`;

/*
export const BOARD_BY_TITLE_QUERY = `
  query boardByTitle($title: String!) {
    boardByTitle(title: $title) {
      _id
      title
      description
      locked
      columns {
        data {
          _id
          title
          description
          weight
          cards {
            data {
              _id
              title
              description
              weight
            }
          }
        }
      }
    }
  }
`;
*/

export const BOARD_BY_USER_QUERY = `
	query boardByUserId($userId: String!) {
    boardByUserId(userId: $userId) {
        _id
        title
        description
        locked
        columns {
          data {
            _id
            title
            description
            weight
            cards {
              data {
                _id
                title
                description
                weight
              }
            }
          }
        }
    }
  }`;
