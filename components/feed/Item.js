import { useEffect, useState } from 'react'
// import { useAppContext } from '../../context/context'
import Border from '../common/Border'
import PostHeader from './PostHeader'
import ActionButtons from './ActionButtons'
import Caption from './Caption'
// import AddComment from '../AddComment'
import PostImage from './PostImage'
// import truncateEthAddress from 'truncate-eth-address'

const style = {
    wrapper: `feed-item-container flex flex-col`,
    buttonsContainer: `feed-item-buttons-container w-full h-10 pl-2 pr-2 mt-2 flex items-center`,
    likesContainer: `feed-item-text text-14-bold mr-1 ml-4`,
}

const FeedItem = ({ data }) => {
    // const { userAddress } = useAppContext()
    const [randomLikeNumber, setRandomLikeNumber] = useState(0)
    console.log(data)
    useEffect(() => {
        setRandomLikeNumber(Math.floor(Math.random() * 100))
    }, [])

    return (
        <Border className={style.wrapper}>
            <PostHeader username={data.owner.toString()} />
            <PostImage imgUrl={data.image} />

            <ActionButtons id={data.id.toString()} className={style.buttonsContainer} />

            <a className={style.likesContainer}>{data.likes.toString()} likes</a>

            <Caption
                data={{
                    username: "lance",
                    caption: data.title,
                }}
            />

            {/* <AddComment /> */}
        </Border>
    )
}

export default FeedItem
