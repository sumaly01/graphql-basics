const users = [
  {
    id: "1",
    name: "Sumaly",
    email: "sumaly@gmail.com",
  },
  {
    id: "2",
    name: "sara",
    email: "sara@gmail.com",
  },
  {
    id: "3",
    name: "mike",
    email: "mike@gmail.com",
  },
];

const posts = [
  {
    id: "1",
    title: "Title 1",
    body: "body 1",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "Title 2",
    body: "body 2",
    published: true,
    author: "2",
  },
  {
    id: "3",
    title: "Title 3",
    body: "body 3",
    published: true,
    author: "2",
  },
];

const comments = [
  {
    id: "2",
    text: "Hi",
    author: "2",
    post: "1",
  },
  {
    id: "5",
    text: "There",
    author: "2",
    post: "2",
  },
  {
    id: "3",
    text: "Bye",
    author: "3",
    post: "1",
  },
  {
    id: "67",
    text: "THere",
    author: "3",
    post: "1",
  },
];
const db = {
  users,
  posts,
  comments,
};

export { db as default };
