import { ApolloServer, gql } from "apollo-server";
import {v1 as uuid} from 'uuid'

// User List
const usersDB = [
  {
    id: "1",
    email: "john@mail.com",
    password: "changeme",
    name: "Jhon",
    age: 30,
    role: "customer",
    street: "santa fe",
    number: "1234",
    avatar: "https://picsum.photos/640/640?r=1756"
  },
  {
    id: "2",
    email: "maria@mail.com",
    password: "12345",
    name: "Maria",
    age: 25,
    role: "customer",
    street: "corrientes",
    number: "5678",
  },
  {
    id: "3",
    email: "admin@mail.com",
    password: "admin123",
    name: "Admin",
    age: 17,
    role: "admin",
    street: "jujuy",
    number: "1774",
    avatar: "https://picsum.photos/640/640?r=8575"
  },
  {
    id: "4",
    email: "nicolas@gmail.com",
    password: "bca123asdasd",
    name: "Nicolas Tesla",
    age: 15,
    role: "admin",
    street: "cordoba",
    number: "3546"
  }
];

const typeDefs = gql`

  type User {
    id:         String!
    email:      String!
    name:       String!
    age:        Int!
    role:       String!
    avatar:     String
    older:      Boolean
    address:    Address
  }


  type Address {
    street:     String!
    number:     String!
  }

  type Query {
    getUsers:                [User]!
    usersCount:              Int!
    findUser(name: String!): User
  }

  type Mutation {
    createUser(
      email: String!, 
      name: String!,
      age: Int!, 
      role: String!
    ): User
  }

`

const resolvers = {

  User: {
    older: (user) => {
      return user.age > 18
    },
    address: (user) => {
      return {
        street: user.street,
        number: user.number
      }
    }
  },

  Query: {
    getUsers:   () => usersDB,
    usersCount: () => usersDB.length,
    findUser: (root, args) => {
      const { name } = args;
      return usersDB.find((user) => user.name === name);
    }
  },

  Mutation: {
    createUser: (parent, args) => {
      const user = { ...args, id: uuid() };
      usersDB.push(user); // Update database
      return user;
    }
  }


};

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
})