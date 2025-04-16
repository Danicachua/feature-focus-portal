
import { PackageIcon, TrendingUpIcon, UsersIcon, DollarSignIcon } from "lucide-react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ProductCard } from "@/components/ProductCard";
import { SidebarProvider } from "@/components/ui/sidebar";

const products = [
  {
    name: "Wireless Headphones",
    description: "Premium noise-canceling headphones with 30-hour battery life",
    status: "In Stock",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
  },
  {
    name: "Smart Watch",
    description: "Fitness tracking and notifications with 5-day battery life",
    status: "Low Stock",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
  },
  {
    name: "Laptop Pro",
    description: "15-inch powerhouse with latest gen processor",
    status: "Out of Stock",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80"
  },
] as const;

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title="Total Products"
                value="2,420"
                description="Active products in catalog"
                icon={PackageIcon}
                trend="up"
                trendValue="12% from last month"
              />
              <StatsCard
                title="Revenue"
                value="$45,231"
                description="Monthly revenue"
                icon={DollarSignIcon}
                trend="up"
                trendValue="8.2% from last month"
              />
              <StatsCard
                title="Active Users"
                value="1,893"
                description="Users active today"
                icon={UsersIcon}
                trend="down"
                trendValue="4% from yesterday"
              />
              <StatsCard
                title="Growth"
                value="32.5%"
                description="Annual growth rate"
                icon={TrendingUpIcon}
                trend="up"
                trendValue="2.4% from last year"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Top Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.name} {...product} />
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-4">Activity</h2>
                <RecentActivity />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
