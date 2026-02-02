import { Navbar } from "@/components/Navbar";
import { useOrders } from "@/hooks/use-orders";
import { Loader2, Package, Clock, CheckCircle2, XCircle, Truck, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function Orders() {
  const { data: orders, isLoading } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'paid': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'paid': return <CheckCircle2 className="w-4 h-4" />;
      case 'delivered': return <Truck className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-display font-bold mb-8">My Orders</h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
            <div className="w-16 h-16 bg-secondary mx-auto rounded-full flex items-center justify-center mb-6 text-muted-foreground">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No orders yet</h3>
            <p className="text-muted-foreground">Start shopping to see your orders here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="p-6 border-b border-border bg-secondary/20 flex flex-wrap gap-4 justify-between items-center">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Order #{order.id}</span>
                    <p className="font-medium mt-1">{format(new Date(order.createdAt!), 'MMM d, yyyy • h:mm a')}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                             x{item.quantity}
                          </div>
                          <span className="font-medium">{item.product.name}</span>
                        </div>
                        <span className="text-muted-foreground">{item.price} KSH</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-border gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">{order.totalAmount} KSH</p>
                    </div>

                    {order.status === 'pending' && (
                      <a 
                        href="https://paystack.com/buy/weeeeed-zmonvx" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary w-full sm:w-auto gap-2 animate-pulse"
                      >
                         Pay Now <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {order.status === 'pending' && (
                    <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-center gap-2">
                       <Truck className="w-4 h-4" /> 
                       Standard Delivery Fee: 70 KSH included in total.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
