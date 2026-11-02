// "use client"

// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// const Home = () => {
//     const router = useRouter();

//     useEffect(() => {
//       return  router.replace('/seller-dashboard');
//     }, [router]);
// };

// export default Home;




// import { redirect } from 'next/navigation';

// export default function Home() {
//   redirect('/seller-dashboard');
// }






import SigninForm from '@/components/auth/Login';
// import CreateStore from '@/components/dashboardLayout/StoreAccountForm';


const StoreCreatePage = () => {
  return (
    <div>
      {/* <CreateStore /> */}
      <SigninForm />
    </div>
  );
};

export default StoreCreatePage;