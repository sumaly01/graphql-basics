import uuidv4 from "uuid/v4";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => {
      return user.email === args.data.email;
    });
    if (emailTaken) {
      throw new Error("Email taken.");
    }

    const user = {
      id: uuidv4(),
      ...args.data,
    };
    db.users.push(user);
    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => {
      return user.id === args.id;
    });
    if (userIndex === -1) {
      throw new Error("user not found");
    }
    const deletedUsers = db.users.splice(userIndex, 1);
    posts = db.posts.filter((post) => {
      const match = post.author === args.id;
      if (match) {
        comments = db.comments.filter((comment) => {
          return comment.post !== post.id;
        });
      }
      return !match;
    });
    comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUsers[0];
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => {
      return user.id === id;
    });
    if (!user) {
      throw new Error("no user");
    }
    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => {
        return user.email === data.email;
      });
      if (emailTaken) {
        throw new Error("Email taken");
      }
      user.email = data.email;
    }
    if (typeof data.name === "string") {
      user.name = data.name;
    }
    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }
    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => {
      return user.id === args.data.author;
    });
    if (!userExists) {
      throw new Error("User not found");
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };
    db.posts.push(post);

    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }
    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    //   //destrcuturing froma array

    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });
    }

    return post; /*deletedPosts[0];*/
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }
    } else if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },
  // updatePost(parent, args, { db, pubsub }, info) {
  //   const { id, data } = args;
  //   const post = db.posts.find((post) => {
  //     return post.id === id;
  //   });
  //   const originalPost = { ...post };
  //   if (!post) {
  //     throw new Error("no post");
  //   }
  //   if (typeof data.title === "string") {
  //     post.title = data.title;
  //   }
  //   if (typeof data.body === "string") {
  //     post.body = data.body;
  //   }
  //   if (typeof data.published === "boolean") {
  //     post.published = data.published;
  //     if (originalPost.published && !post.published) {
  //       //deleted
  //       pubsub.publish("post", {
  //         post: {
  //           mutation: "DELETED",
  //           data: originalPost,
  //         },
  //       });
  //     } else if (!originalPost.published && post.published) {
  //       //created
  //       pubsub.publish("post", {
  //         post: {
  //           mutation: "CREATED",
  //           data: post,
  //         },
  //       });
  //     } else if (post.published) {
  //       //updated
  //       pubsub.publish("post", {
  //         post: {
  //           mutation: "UPDATED",
  //           data: post,
  //         },
  //       });
  //     }
  //   }
  //   return post;
  // },
  // deletePost(parent, args, { db, pubsub }, info) {
  //   const postIndex = db.posts.findIndex((post) => {
  //     return post.id === args.id;
  //   });
  //   if (postIndex === -1) {
  //     throw new Error("No posts found");
  //   }
  //   //destrcuturing froma array
  //   const [post] = db.posts.splice(postIndex, 1);
  //   db.comments = db.comments.filter((comment) => {
  //     const match = comment.post === args.id;
  //     return !match;
  //   });
  //   if (post.published) {
  //     pubsub.publish("post", {
  //       post: {
  //         mutation: "DELETED",
  //         data: post /*deletedPosts[0]*/,
  //       },
  //     });
  //   }
  //   return post; /*deletedPosts[0];*/
  // },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => {
      return user.id === args.data.author;
    });
    if (!userExists) {
      throw new Error("User doesnt exist");
    }
    const postExists = db.posts.some((post) => {
      return post.id === args.data.post && post.published;
    });
    if (!postExists) {
      throw new Error("No post found");
    }
    const comment = {
      id: uuidv4(),
      ...args.data,
    };
    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });
    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => {
      return comment.id === id;
    });
    if (!comment) {
      throw new Error("no comment");
    }
    if (typeof data.text === "string") {
      comment.text = data.text;
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });
    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex((comment) => {
      return comment.id === args.id;
    });
    if (commentIndex === -1) {
      throw new Error("No comments found");
    }
    const [deletedComment] = db.comments.splice(commentIndex, 1);
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });
    return deletedComment;
  },
};

export { Mutation as default };
