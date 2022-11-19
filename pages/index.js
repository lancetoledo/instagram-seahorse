import { data } from '../static/data'
import Layout from "../components/Layout";
import Stories from '../components/stories/Stories';
import HomeRightBar from '../components/HomeRightBar';
import FeedItem from '../components/feed/Item';
import { useGlobalState } from "../hooks";

export default function Home() {


  const style = {
    container: `homepage-feed lg:mr-8 flex flex-col`,
  }

  //SOLANA STUFF
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


  return (
    <Layout>
      <div className={style.container}>
        <Stories stories={data.stories} />

        <>
          {/* <WalletMultiButton /> */}
          {console.log(hasUserAccount, "AHH")}
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
              <FeedItem data={post} key={i} />
            ))
            : "Loading..."}
        </>


        {/* {feed.map((item, index) => (
          <FeedItem data={item} key={index} />
        ))} */}

        {/* OLD RENDERING
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
        
        */}
      </div>
      <HomeRightBar data={data.suggestions} />
    </Layout>
  );
}
