import '../styles/home2.css';
// import HeroBanner from "../components/HeroBanner";
// import AboutScroll from "../components/AboutScroll";
import HomeAbout from "../components/homeabout";
import Homefeatured from "../components/Homefeatured";
import Homeprojects from "../components/Homeprojects";
// import Homeresidential from "../components/Homeresidential";
import Homesapphire from "../components/Homesapphire"; 
import Homeblogs from "../components/Homeblogs";
import ContactCTA from "../components/ContactCTA";
import Homeskyline from "../components/Homeskyline";

const Home2 = () => { 
  return (

    <main className="home-page"> 
        <Homesapphire />
        <Homeskyline />
        {/* <HeroBanner />  */}
        {/* <AboutScroll /> */}
        <HomeAbout /> 
        <Homefeatured /> 
        <Homeprojects /> 
        {/* <Homeresidential />  */}
        <Homeblogs /> 
        <ContactCTA /> 
    </main>
    
  );
};

export default Home2;