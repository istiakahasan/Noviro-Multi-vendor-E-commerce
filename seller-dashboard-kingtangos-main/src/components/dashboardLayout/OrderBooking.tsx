import React from "react";
import { OrderBookingMatrix } from "./OrderBookingMatrix";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Products from "./Orders&Bookings/Products";
import Services from "./Orders&Bookings/Services";
import Consultations from "./Orders&Bookings/Consultations";
import Subscriptions from "./Subscriptions";
import AllOrdersData from "./Orders&Bookings/AllOrdersData";

const OrderBooking = () => {
  return (
    <div>
      <OrderBookingMatrix />
      <main className="mt-8">
        <Tabs defaultValue="all" className="w-full">
          {/* Tabs List Section (Centered and Constrained) */}
          <div className="w-full flex justify-start">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            </TabsList>
          </div>

          {/* Tabs Content Section (Full Width) */}
          <div className="w-full">
            <TabsContent value="all" className="mt-0">
              <AllOrdersData />
            </TabsContent>
            <TabsContent value="products" className="mt-0">
              <Products />
            </TabsContent>

            <TabsContent value="services" className="mt-0">
              <Services />
            </TabsContent>

            <TabsContent value="consultations" className="mt-0">
              <Consultations />
            </TabsContent>
            <TabsContent value="subscriptions" className="mt-0">
              <Subscriptions />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default OrderBooking;
