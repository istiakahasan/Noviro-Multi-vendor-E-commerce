"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaUser,
  FaQuestionCircle,
  FaShoppingCart,
  FaChevronDown,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import Link from "next/link";
import Logo from "@/assets/logo.png";
import Image from "next/image";
import { Button } from "../ui/button";
import { useCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetSubCategoryByIdQuery } from "@/redux/api/subCategoryApi";
import { Badge } from "../ui/badge";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import Cookies from "js-cookie";
import { useGetAddToCartQuery } from "@/redux/api/cartApi";
import { NotificationButton } from "../notification/NotificationButton";
import { FaHeart } from "react-icons/fa6";
import { useMyWishlistQuery } from "@/redux/api/userDashbord/userDashbordApi";
import { useSession, signOut } from "next-auth/react"; // ✅ Only add this import

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Get session from next-auth (for Google login)
  const { data: session } = useSession();
  
  // Store backend tokens from Google login in cookies
  useEffect(() => {
    if (session?.accessToken) {
      Cookies.set("accessToken", session.accessToken);
    }
  }, [session?.accessToken]);

  // Get user data from backend API (for email/password login)
  const hasAccessToken =
    typeof window !== "undefined" && Cookies.get("accessToken");
  const { data: userData } = useGetMeQuery(undefined, {
    skip: !hasAccessToken,
  });

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Unified authentication
  const isAuthenticated = !!userData?.data?.id || !!session?.user;

  // Unified user object
  const user = userData?.data || (session?.userData
    ? session.userData
    : session?.user
    ? {
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        email: session.user.email,
        profilePic: session.user.image,
        role: "user",
      }
    : null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesOpen(false);
      }

      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // ✅ Only update the logout function
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Sign out from NextAuth (for Google login)
      await signOut({ redirect: false });
      
      // Clear cookies
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      // Dispatch logout action to clear Redux state
      dispatch(logout());

      // Close dropdowns
      setIsUserDropdownOpen(false);
      setIsSidebarOpen(false);

      // Wait a bit to ensure state is cleared
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Redirect to login page
      router.push("/login");
      router.refresh(); // Force refresh to clear NextAuth session
      
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/product", label: "PRODUCT" },
    { href: "/service", label: "SERVICE" },
    { href: "/consultation", label: "CONSULTATION" },
    { href: "/subscription", label: "SUBSCRIPTION" },
  ];

  const { data, isError, isLoading } = useCategoriesQuery(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const {
    // data: subCategoryData,
    // isFetching: isSubLoading,
  } = useGetSubCategoryByIdQuery(selectedCategoryId!, {
    skip: !selectedCategoryId,
  });

  const categories = data?.data || [];

  const { data: cartData } = useGetAddToCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const cartCount =
    cartData?.data?.items.reduce((total, item) => total + item.quantity, 0) ??
    0;

  const { data: wishlistResponse } = useMyWishlistQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !isAuthenticated,
  });

  const wishlistCount = wishlistResponse?.data?.length || 0;

  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search-result?q=${encodeURIComponent(query)}`);
  };

  if (isLoading) return null;
  if (isError) return <p>Failed to load categories.</p>;

  return (
    <div className="top-0 left-0 w-full z-50 bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-[58px] w-[160px] flex items-center justify-center rounded-md">
                <Image
                  src={Logo}
                  alt="logo"
                  width={500}
                  height={500}
                  className="h-[58px] w-[160px]"
                />
              </div>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search anything, find everything"
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full px-4 bg-gray-800 text-white rounded-r-full hover:bg-gray-700"
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            {isAuthenticated && user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 text-black hover:text-gray-800 cursor-pointer"
                >
                  {user?.profilePic ? (
                    <Image
                      src={user.profilePic}
                      alt={user.firstName || "User"}
                      width={32}
                      height={32}
                      className="rounded-full border border-gray-300"
                    />
                  ) : (
                    <FaUserCircle size={24} />
                  )}
                  <span className="text-sm">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <FaChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      isUserDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                      <p className="text-xs text-gray-500 capitalize mt-1">
                        {user?.role?.toLowerCase().replace("_", " ") || "user"}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/user/my-account"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <FaUser className="mr-3" size={14} />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FaSignOutAlt className="mr-3" size={14} />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <div className="flex items-center space-x-1 text-black hover:text-gray-800 cursor-pointer">
                  <FaUser size={16} />
                  <span className="text-sm">Login</span>
                </div>
              </Link>
            )}

            <Link href={"/support"}>
              <div className="flex items-center space-x-1 text-black hover:text-gray-800 cursor-pointer">
                <FaQuestionCircle size={16} />
                <span className="text-sm">Support</span>
              </div>
            </Link>

            <div className="flex items-center space-x-1 text-black hover:text-gray-800 cursor-pointer">
              <NotificationButton />
            </div>

            {/* wishlist */}
            {isAuthenticated ? (
              <Link href="/user/my-wishlist">
                <div className="flex items-center space-x-1 text-black hover:text-gray-800 cursor-pointer">
                  <div className="relative inline-block">
                    {wishlistCount > 0 && (
                      <Badge
                        className="absolute -top-3.5 -right-2 z-20 h-5 min-w-5 rounded-full px-1 text-xs flex items-center justify-center"
                        variant="destructive"
                      >
                        {wishlistCount > 99 ? "99+" : wishlistCount}
                      </Badge>
                    )}
                    <FaHeart size={18} />
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <div className="flex items-center space-x-1 text-black hover:text-gray-800 cursor-pointer">
                  <div className="relative inline-block">
                    <FaHeart size={18} />
                  </div>
                </div>
              </Link>
            )}

            {isAuthenticated ? (
              <Link href="/cart">
                <div className="flex items-center space-x-1 text-black hover:text-gray-800 cursor-pointer">
                  <div className="relative inline-block">
                    {cartCount > 0 && (
                      <Badge
                        className="absolute -top-3.5 -right-2 z-50 h-5 min-w-5 rounded-full px-1 text-xs flex items-center justify-center"
                        variant="destructive"
                      >
                        {cartCount > 99 ? "99+" : cartCount}
                      </Badge>
                    )}
                    <FaShoppingCart size={18} />
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <div className="flex items-center space-x-1 text-black hover:text-gray-800 cursor-pointer">
                  <div className="relative inline-block">
                    <FaShoppingCart size={18} />
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 focus:outline-none hover:text-gray-800"
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Keep your existing categories section - unchanged */}
      <div className="mt-3">
        <div className="container mx-auto px-4 hidden lg:flex">
          <div className="flex items-center space-x-8">
            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <Button
                onClick={toggleCategories}
                className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-3 hover:bg-gray-700 transition-colors"
              >
                <FaBars size={14} />
                <span className="font-medium">ALL CATEGORIES</span>
                <FaChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    isCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {/* Categories Dropdown Menu */}
              <div
                className={`hidden lg:flex flex-col absolute top-full left-0 w-80 bg-white border border-gray-200 z-50 transition-all duration-300 ease-in-out mt-3 rounded-lg ${
                  isCategoriesOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                {categories.map((category) => (
                  <div key={category.id} className="border-b border-gray-100">
                    <button
                      onClick={() =>
                        setSelectedCategoryId((prev) =>
                          prev === category.id ? null : category.id,
                        )
                      }
                      className="flex w-full items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50"
                    >
                      <Link href={`/category/${category.id}`}>
                        <span>{category.name}</span>
                      </Link>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Links - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-1.5 px-6 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-gray-900 border-2 border-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keep your existing mobile sidebar - unchanged */}
      <div
        className={`fixed top-0 left-0 w-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out h-full ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="h-[58px] w-[160px] flex items-center justify-center rounded-md">
                  <Image
                    src={Logo}
                    alt="logo"
                    width={500}
                    height={500}
                    className="h-[40px] w-[130px]"
                  />
                </div>
              </Link>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-gray-600 focus:outline-none hover:text-gray-800"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search anything, find everything"
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-gray-800 text-white rounded-r-md">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex flex-col space-y-4 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 px-4 rounded-md transition-colors ${
                  pathname === link.href
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Categories */}
          <div className="mb-6">
            <div className="font-medium text-gray-700 mb-2">CATEGORIES</div>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex w-full items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile User Actions */}
          <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    {user?.profilePic ? (
                      <Image
                        src={user.profilePic}
                        alt={user.firstName || "User"}
                        width={32}
                        height={32}
                        className="rounded-full border border-gray-300"
                      />
                    ) : (
                      <FaUserCircle size={20} />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 py-2"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FaUser size={16} />
                  <span>My Profile</span>
                </Link>
                {user?.stores && (
                  <Link
                    href="/dashboard/store"
                    className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 py-2"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaUser size={16} />
                    <span>My Store</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-3 text-red-600 hover:text-red-800 py-2 disabled:opacity-50"
                >
                  <FaSignOutAlt size={16} />
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 py-2"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaUser size={16} />
                <span>Login/Signup</span>
              </Link>
            )}

            <div className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 cursor-pointer py-2">
              <NotificationButton />
              <span>Notifications</span>
            </div>
            <Link href={"/support"} onClick={() => setIsSidebarOpen(false)}>
              <div className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 cursor-pointer py-2">
                <FaQuestionCircle size={16} />
                <span>Support</span>
              </div>
            </Link>

            {isAuthenticated ? (
              <Link href="/user/my-wishlist">
                <div className="flex items-center space-x-1 text-black hover:text-gray-800 cursor-pointer">
                  <div className="relative inline-block ">
                    <div className="flex gap-2">
                      <div>
                        {wishlistCount > 0 && (
                          <Badge
                            className="absolute -top-3.5 left-2 z-20 h-5 min-w-5 rounded-full px-1 text-xs flex items-center justify-center"
                            variant="destructive"
                          >
                            {wishlistCount > 99 ? "99+" : wishlistCount}
                          </Badge>
                        )}
                        <FaHeart
                          size={18}
                          className="text-gray-600 hover:text-gray-800"
                        />
                      </div>
                      <span className="text-sm text-gray-600 hover:text-gray-800">
                        Wishlist
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <div className="flex items-center gap-1.5 space-x-1 text-black hover:text-gray-800 cursor-pointer">
                  <div className="relative inline-block">
                    <FaHeart
                      size={18}
                      className="text-gray-600 hover:text-gray-800"
                    />
                  </div>
                  <span className="text-sm text-gray-600 hover:text-gray-800">
                    Wishlist
                  </span>
                </div>
              </Link>
            )}
            {isAuthenticated ? (
              <Link href={"/cart"} onClick={() => setIsSidebarOpen(false)}>
                <div className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 cursor-pointer py-2">
                  <div className="relative inline-block">
                    <Badge
                      className="absolute -top-3.5 -right-2 z-50 h-5 min-w-5 rounded-full px-1 text-xs flex items-center justify-center"
                      variant="destructive"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </Badge>
                    <FaShoppingCart size={18} />
                  </div>
                  <span>Cart</span>
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <div className="flex items-center space-x-1 text-black hover:text-gray-800 cursor-pointer">
                  <div className="relative inline-block">
                    <FaShoppingCart size={18} />
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for sidebar and categories */}
      {(isSidebarOpen || isCategoriesOpen || isUserDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsCategoriesOpen(false);
            setIsUserDropdownOpen(false);
          }}
        ></div>
      )}
    </div>
  );
}