import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { useGlobalState } from "../hooks";

export default function Main() {
  const {
    isConnected,
    wallet,
    hasUserAccount,
    posts,
    createUser,
    createPost,
    updatePost,
    deletePost,
    likePost,
    dislikePost,
  } = useGlobalState();
  // console.log(hasUserAccount, "IS TGHER USER??")
  return (
    <>
      <WalletMultiButton />
      {hasUserAccount ? (
        <button
          onClick={() =>
            createPost(
              "Title",
              "https://cdn.discordapp.com/avatars/202176522075897866/a_76ca08f62f47e9c5629a0844a361c208.gif"
            )
          }
        >
          Create post
        </button>
      ) : (
        isConnected && <button onClick={createUser}>Create user</button>
      )}

      {/* Render posts */}
      {posts
        ? posts.map((post, i) => (
          <div key={i}>
            <div>{post.title}</div>
            <img src={post.image} style={{ background: "purple" }} />
            <div>
              {post.likes.toString()} {post.likes.gtn(1) ? "likes" : "like"}
            </div>
            <div>
              {wallet?.publicKey && post.owner.equals(wallet.publicKey) && (
                <>
                  <button
                    onClick={() =>
                      updatePost(post.owner, post.id, "New title")
                    }
                  >
                    Update post
                  </button>
                  <button onClick={() => deletePost(post.owner, post.id)}>
                    Delete post
                  </button>
                </>
              )}
              <button
                onClick={() =>
                  likePost(post.owner, post.id, wallet.publicKey)
                }
                disabled={!hasUserAccount}
              >
                Like post
              </button>
              <button
                onClick={() =>
                  dislikePost(post.owner, post.id, wallet.publicKey)
                }
                disabled={!hasUserAccount}
              >
                Dislike post
              </button>
            </div>
          </div>
        ))
        : "Loading..."}
    </>
  );
}
