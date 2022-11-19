import { data } from '../static/data'
import Layout from "../components/Layout";
import Stories from '../components/stories/Stories';
import HomeRightBar from '../components/HomeRightBar';

export default function Home() {


  const style = {
    container: `homepage-feed lg:mr-8 flex flex-col`,
  }

  return (
    <Layout>
      <div className={style.container}>
        <Stories stories={data.stories} />
        {/* {feed.map((item, index) => (
          <FeedItem data={item} key={index} />
        ))} */}
      </div>
      <HomeRightBar data={data.suggestions} />
    </Layout>
  );
}
