import {useContext} from "react";
import Layout from "../components/Layout/Layout";
import { GlobalContext } from "../context/GlobalContext";
import Hero from "@/components/Home/Hero";
import Info from "@/components/Home/Info";
import HomeAbout from "@/components/Home/HomeAbout";

const Home = () => {
    return (
      <Layout>
        <Hero />
        <HomeAbout/>
        <Info/>
      </Layout>
    );
};

export default Home;
