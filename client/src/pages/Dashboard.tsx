import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { CreateProductDialog } from "@/components/CreateProductDialog";
import { useProducts } from "@/hooks/use-products";
import { useOrders } from "@/hooks/use-orders";
import { Loader2, Package, TrendingUp, Users, DollarSign, Edit } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: orders, isLoading: loadingOrders } = useOrders();

  // Simple stats calculation
  const totalRevenue = orders?.reduce((acc, order) => acc + (order.status === 'paid' || order.status === 'delivered' ? order.totalAmount : 0), 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Welcome back, {user?.firstName}
            </h1>
            <p className="text-muted-foreground">Manage your products and view incoming orders.</p>
          </div>
          <CreateProductDialog />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold">{totalRevenue} KSH</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Pending Orders</p>
                <h3 className="text-2xl font-bold">{pendingOrders}</h3>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Active Products</p>
                <h3 className="text-2xl font-bold">{products?.length || 0}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Product Management */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold">Your Products</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadingProducts ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading products...
                    </td>
                  </tr>
                ) : products?.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-secondary" />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{product.price} KSH</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-primary/80 font-medium text-sm inline-flex items-center gap-1">
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
