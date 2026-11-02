
import AdsAnalytics from "./AdsAnalytics ";
import AdvertisingGrid from "./AdvertisingGrid";
import { CouponTable } from "./CouponTable";

export default function MarketingPromotion() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        {/* <div className="mb-2 text-sm text-muted-foreground">
          Dashboard {">"} Marketing & Promotions
        </div> */}
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-foreground">
          Marketing & Promotions
        </h1>
      </div>

      {/* Content */}
      <div className="space-y-12 md:p-6">
        {/* Coupon Section */}
        <section>
          <CouponTable />
        </section>

        {/* Advertising Section */}
        <section className="mt-32">
          <AdvertisingGrid />
        </section>
        <section className="mt-16">
          <AdsAnalytics />
        </section>
      </div>
    </main>
  );
}
