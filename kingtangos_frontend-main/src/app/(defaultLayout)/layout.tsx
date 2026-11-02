import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import SubNavbar from "@/components/common/SubNavbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <SubNavbar />
    <Navbar />
      <main className="mt-16 md:bg-background bg-none">{children}</main>
      <Footer />
    </>
  );
};

export default CommonLayout;
