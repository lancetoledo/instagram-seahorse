import { createContext, useCallback, useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

import {
  getLikeAccountPk,
  getPostAccountPk,
  getProgram,
  getUserAccountPk,
} from "../utils";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const GlobalContext = createContext({
  isConnected: null,
  wallet: null,
  hasUserAccount: null,
  posts: null,
  fetchPosts: null,
  createUser: null,
  createPost: null,
  updatePost: null,
  deletePost: null,
  likePost: null,
  dislikePost: null,
});

export const GlobalState = ({ children }) => {
  const [program, setProgram] = useState();
  const [isConnected, setIsConnected] = useState();
  const [userAccount, setUserAccount] = useState();
  const [posts, setPosts] = useState();

  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  // Set program
  useEffect(() => {
    if (connection) {
      setProgram(getProgram(connection, wallet ?? {}));
    } else {
      setProgram(null);
    }
  }, [connection, wallet]);

  // Check wallet connection
  useEffect(() => {
    setIsConnected(!!wallet?.publicKey);
  }, [wallet]);

  const fetchUserAccount = useCallback(async () => {
    if (!program) return;

    try {
      const userAccountPk = await getUserAccountPk(wallet.publicKey);
      const userAccount = await program.account.user.fetch(userAccountPk);
      setUserAccount(userAccount);
    } catch (e) {
      setUserAccount(null);
    }
  }, [program]);

  // Check for user account
  useEffect(() => {
    fetchUserAccount();
  }, []);

  const fetchPosts = useCallback(async () => {
    if (!program) return;
    const posts = await program.account.post.all();
    setPosts(posts.map((post) => post.account));
  }, [program]);

  // Get and update posts
  useEffect(() => {
    if (!posts) {
      // Fetch posts if posts don't exists
      fetchPosts();
    }
  }, [posts, fetchPosts]);

  // Program events
  useEffect(() => {
    if (!program) return;

    // New post event
    const newPostEventListener = program.addEventListener(
      "NewPostEvent",
      async (postEvent) => {
        try {
          const postAccountPk = await getPostAccountPk(
            postEvent.owner,
            postEvent.id
          );
          const newPost = await program.account.post.fetch(postAccountPk);
          setPosts((posts) => [newPost, ...posts]);
        } catch (e) {
          console.log("Couldn't fetch new post account", postEvent, e);
        }
      }
    );

    // Update post event
    const updatePostEventListener = program.addEventListener(
      "UpdatePostEvent",
      async (updateEvent) => {
        try {
          const postAccountPk = await getPostAccountPk(
            updateEvent.owner,
            updateEvent.id
          );
          const updatedPost = await program.account.post.fetch(postAccountPk);
          setPosts((posts) =>
            posts.map((post) => {
              if (
                post.owner.equals(updatedPost.owner) &&
                post.id.eq(updatedPost.id)
              ) {
                return updatedPost;
              }
              return post;
            })
          );
        } catch (e) {
          console.log("Couldn't fetch updated post account", updateEvent, e);
        }
      }
    );

    // Delete post event
    const deletePostEventListener = program.addEventListener(
      "DeletePostEvent",
      (deleteEvent) => {
        setPosts((posts) =>
          posts.filter(
            (post) =>
              !(
                post.owner.equals(deleteEvent.owner) &&
                post.id.eq(deleteEvent.id)
              )
          )
        );
      }
    );

    // Like/dislike post event
    const likeDislikePostEventListener = program.addEventListener(
      "LikeDislikePostEvent",
      (likeDislikeEvent) => {
        setPosts((posts) =>
          posts.map((post) => {
            if (
              post.owner.equals(likeDislikeEvent.owner) &&
              post.id.eq(likeDislikeEvent.id)
            ) {
              return { ...post, likes: likeDislikeEvent.likes };
            }
            return post;
          })
        );
      }
    );

    return () => {
      program.removeEventListener(newPostEventListener);
      program.removeEventListener(updatePostEventListener);
      program.removeEventListener(deletePostEventListener);
      program.removeEventListener(likeDislikePostEventListener);
    };
  }, [program]);

  // Airdrop when the balance is less than 1 SOL
  const airdrop = async () => {
    if (!connection || !wallet?.publicKey) return;
    const balance = await connection.getBalance(wallet.publicKey);
    if (balance < LAMPORTS_PER_SOL) {
      const txHash = await connection.requestAirdrop(
        wallet.publicKey,
        LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(txHash);
    }
  };

  const createUser = useCallback(async () => {
    if (!program) return;

    try {
      await airdrop();
      const txHash = await program.methods
        .createUser()
        .accounts({
          user: await getUserAccountPk(wallet.publicKey),
          owner: wallet.publicKey,
        })
        .rpc();
      await connection.confirmTransaction(txHash);
      console.log("Created user", txHash);
      await fetchUserAccount();
    } catch (e) {
      console.log("Couldn't create user:", e.message);
    }
  }, [program]);

  const createPost = useCallback(
    async (title, image) => {
      if (!userAccount) return;

      try {
        const postId = userAccount.lastPostId.addn(1);
        const txHash = await program.methods
          .createPost(title, image, postId)
          .accounts({
            post: await getPostAccountPk(wallet.publicKey, postId.toNumber()),
            user: await getUserAccountPk(wallet.publicKey),
            owner: wallet.publicKey,
          })
          .rpc();
        await connection.confirmTransaction(txHash);
        console.log("Created post", txHash);

        // Update user account
        await fetchUserAccount();
      } catch (e) {
        console.log("Couldn't create post:", e.message);
      }
    },
    [userAccount]
  );

  const updatePost = useCallback(
    async (owner, id, title) => {
      if (!userAccount) return;

      try {
        const txHash = await program.methods
          .updatePost(title)
          .accounts({
            post: await getPostAccountPk(owner, id),
            owner,
          })
          .rpc();
        console.log("Updated post", txHash);
      } catch (e) {
        console.log("Couldn't update post:", e.message);
      }
    },
    [userAccount]
  );

  const deletePost = useCallback(
    async (owner, id) => {
      if (!userAccount) return;

      try {
        const txHash = await program.methods
          .deletePost()
          .accounts({
            post: await getPostAccountPk(owner, id),
            owner,
          })
          .rpc();
        console.log("Deleted post", txHash);
      } catch (e) {
        console.log("Couldn't delete post:", e.message);
      }
    },
    [userAccount]
  );

  const likePost = useCallback(
    async (owner, id, liker) => {
      if (!userAccount) return;

      try {
        const txHash = await program.methods
          .likePost()
          .accounts({
            like: await getLikeAccountPk(owner, id, liker),
            post: await getPostAccountPk(owner, id),
            user: await getUserAccountPk(wallet.publicKey),
            owner: wallet.publicKey,
          })
          .rpc();
        console.log("Liked post", txHash);
      } catch (e) {
        console.log("Couldn't like post:", e.message);
      }
    },
    [userAccount]
  );

  const dislikePost = useCallback(
    async (owner, id, disliker) => {
      if (!userAccount) return;

      try {
        const txHash = await program.methods
          .dislikePost()
          .accounts({
            like: await getLikeAccountPk(owner, id, disliker),
            post: await getPostAccountPk(owner, id),
            owner: wallet.publicKey,
          })
          .rpc();
        console.log("Disliked post", txHash);
      } catch (e) {
        console.log("Couldn't dislike post:", e.message);
      }
    },
    [userAccount]
  );

  return (
    <GlobalContext.Provider
      value={{
        isConnected,
        wallet,
        hasUserAccount: !!userAccount,
        posts,
        fetchPosts,
        createUser,
        createPost,
        updatePost,
        deletePost,
        likePost,
        dislikePost,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
