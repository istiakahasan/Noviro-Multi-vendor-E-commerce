import Banner from "@/components/home/Banner";
import BestServices from "@/components/home/BestService";
import Consultant from "@/components/home/Consultant";
import Feature from "@/components/home/Feature";
import NewArrival from "@/components/home/NewArraival";
import Subscription from "@/components/home/Subscription";
import TopDeals from "@/components/home/TopDeals";
import TrustedBy from "@/components/home/TrustedBy";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <Feature />
      <TopDeals />
      <NewArrival />
      <BestServices />
      <Consultant />
      <Subscription />
      <TrustedBy />
    </div>
  );
};

export default HomePage;
