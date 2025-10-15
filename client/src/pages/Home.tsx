import Layout from '../components/Layout/Layout';
import Hero from '@/components/Home/Hero';
import HomeAbout from '@/components/Home/HomeAbout';

const Home = () => {
  return (
    <Layout>
      <Hero />
      <HomeAbout />
    </Layout>
  );
};

export default Home;
