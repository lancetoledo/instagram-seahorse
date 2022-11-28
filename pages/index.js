import { data } from '../static/data'
import Layout from "../components/Layout";
import Stories from '../components/stories/Stories';
import HomeRightBar from '../components/HomeRightBar';
import FeedItem from '../components/feed/Item';
import { useGlobalState } from "../hooks";
import { useState } from 'react';

import EditPostModal from '../components/modals/EditPostModal';
import CreatePostModal from '../components/modals/CreatePostModal';

export default function Home() {
  const [editPostModalOpen, setEditPostModalOpen] = useState(false)
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false)
  const [currentEditPostID, setCurrentEditPostID] = useState(null)

  const toggleEditPostModal = (value, postId, owner) => {
    setCurrentEditPostID(postId)


    setEditPostModalOpen(value)
  }

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
  } = useGlobalState();


  return (
    <Layout
      setCreatePostModalOpen={setCreatePostModalOpen}
    >
      <div className={style.container}>
        <Stories stories={data.stories} />

        <>
          {/* Render posts */}
          {posts
            ? posts.map((post, i) => (
              <FeedItem
                data={post}
                key={i}
                walletKey={wallet?.publicKey}
                setEditPostModalOpen={setEditPostModalOpen}
                toggleEditPostModal={toggleEditPostModal}

              />
            ))
            : "Loading..."}
        </>
        <CreatePostModal createPost={createPost} createPostModalOpen={createPostModalOpen} setCreatePostModalOpen={setCreatePostModalOpen} />
        <EditPostModal updatePost={updatePost} editPostModalOpen={editPostModalOpen} setEditPostModalOpen={setEditPostModalOpen} currentEditPostID={currentEditPostID} />


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
