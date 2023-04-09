import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

let tweets = [
  {
    id: '1',
    text: 'The Awakening',
    userId: '2',
  },
  {
    id: '2',
    text: 'Two Hello',
    userId: '1',
  },
];

let users = [
  {
    id: '10',
    firstName: 'nico',
    lastName: 'las',
  },
  {
    id: '2',
    firstName: 'Elon',
    lastName: 'Mask',
  },
];

const typeDefs = `#graphql
type User{
  id:ID!
  userName:String!
  firstName:String!
  lastName:String!
  fullName:String
}
  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Query {
    allUsers:[User!]!
    allTweet: [Tweet!]!
    tweet(id:ID!):Tweet
  }
  type Mutation{
    postTweet(text:String!, userId:ID):Tweet
    deleteTweet(id:ID!):Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweet() {
      console.log("I'm called");
      return tweets;
    },
    tweet(_, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log('allUsers called');
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      console.log(text, userId);
      const newTweet = {
        id: String(tweets.length + 1),
        text: text,
        userId: userId,
      };
      try {
        if (!users.find((user) => user.id === userId))
          throw new Error('userId is not find');
        const newTweet = {
          id: String(tweets.length + 1),
          text,
          userId,
        };
        tweets.push(newTweet);
        return newTweet;
      } catch (error) {
        console.log(error);
      }
      // const userIdCheck = users.find((user) => user.id === userId);
      // console.log(userIdCheck);
      // if (userIdCheck) {
      //   tweets.push(newTweet);
      //   return newTweet;
      // } else {
      //   console.log('NOTTTT');
      // }
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) {
        return false;
      }
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    userName({ firstName }) {
      return firstName;
    },
    fullName({ firstName, lastName }) {
      console.log('Full name called');
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
