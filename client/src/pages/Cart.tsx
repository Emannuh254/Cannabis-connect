import { Navbar } from "@/components/Navbar";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { Trash2, Plus, Minus, Loader2, ArrowRight, Truck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [address, setAddress] = useState("");

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({ title: "Please login", description: "You need to be logged in to checkout.", variant: "destructive" });
      setTimeout(() => window.location.href = "/api/login", 1000);
      return;
    }

    if (!address || address.length < 5) {
      toast({ title: "Address required", description: "Please enter a valid delivery address.", variant: "destructive" });
      return;
    }

    createOrder(
      {
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        deliveryAddress: address,
      },
      {
        onSuccess: () => {
          clearCart();
          toast({ title: "Order placed!", description: "Redirecting to your orders..." });
          setLocation("/orders");
        },
        onError: (error) => {
          toast({ title: "Checkout failed", description: error.message, variant: "destructive" });
        }
      }
    );
  };

  const deliveryFee = 70;
  const cartTotal = total();
  const finalTotal = cartTotal + deliveryFee;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-display font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border shadow-sm">
            <div className="w-20 h-20 bg-secondary mx-auto rounded-full flex items-center justify-center mb-6 text-muted-foreground">
              <Truck className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
            <Link href="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 bg-card rounded-2xl border border-border shadow-sm items-center">
                  <div className="w-24 h-24 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.product.category}</p>
                    <p className="font-semibold text-primary">{item.product.price} KSH</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-background rounded-md transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-background rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-3xl border border-border shadow-lg sticky top-24">
                <h3 className="font-display font-bold text-xl mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{cartTotal} KSH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-semibold text-emerald-600">+{deliveryFee} KSH</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{finalTotal} KSH</span>
                  </div>
                </div>

                <div className="mb-6 space-y-2">
                  <label className="text-sm font-medium ml-1">Delivery Address</label>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full delivery address..."
                    className="w-full min-h-[80px] p-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full btn-primary h-14 text-lg"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowRight className="w-5 h-5 mr-2" />}
                  Checkout Now
                </button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secure payment via Paystack available after order creation.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
