import { useEffect, useState } from 'react'
// import { useAppContext } from '../../context/context'
import Border from '../common/Border'
import PostHeader from './PostHeader'
import ActionButtons from './ActionButtons'
import Caption from './Caption'
// import AddComment from '../AddComment'
import PostImage from './PostImage'
import { truncate } from '../../utils/truncate'

import { useGlobalState } from "../../hooks";


const style = {
    wrapper: `feed-item-container flex flex-col`,
    buttonsContainer: `feed-item-buttons-container w-full h-10 pl-2 pr-2 mt-2 flex items-center`,
    likesContainer: `feed-item-text text-14-bold mr-1 ml-4`,
}

const FeedItem = ({ data, walletKey, setEditPostModalOpen, toggleEditPostModal, setCreatePostModalOpen }) => {
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


    const [randomLikeNumber, setRandomLikeNumber] = useState(0)
    useEffect(() => {
        setRandomLikeNumber(Math.floor(Math.random() * 100))
    }, [])

    return (
        <Border className={style.wrapper}>
            <PostHeader username={data.owner.toString()} owner={data.owner} postId={data.id} />
            <PostImage imgUrl={data.image} alt="post" />

            <ActionButtons
                id={data.id.toString()}
                className={style.buttonsContainer}
                owner={data.owner}
                postId={data.id}
                walletKey={walletKey}
                setEditPostModalOpen={setEditPostModalOpen}
                toggleEditPostModal={toggleEditPostModal}
                setCreatePostModalOpen={setCreatePostModalOpen}
            />

            <a className={style.likesContainer}>{data.likes.toString()} likes</a>

            <Caption
                data={{
                    username: truncate(data.owner.toString()),
                    caption: data.title,
                }}
            />

            {/* <AddComment /> */}
        </Border>
    )
}

export default FeedItem
