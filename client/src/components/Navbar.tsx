import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Leaf, LogOut, Package, User, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const cartItems = useCart((state) => state.items);
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location === path;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              GreenDrop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className={`text-sm font-medium transition-colors ${isActive('/products') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              Marketplace
            </Link>
            
            {isAuthenticated && (
              <>
                <Link href="/orders" className={`text-sm font-medium transition-colors ${isActive('/orders') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  My Orders
                </Link>
                {/* Admin/Seller Links (Simplistic Role Check - could be improved) */}
                <Link href="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user?.firstName?.[0] || <User className="w-4 h-4" />}
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <a href="/api/login" className="hidden md:flex btn-primary py-2 px-4 text-sm h-10">
                Sign In
              </a>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-foreground" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              <Link href="/products" className="block text-base font-medium text-foreground hover:text-primary" onClick={toggleMobileMenu}>
                Marketplace
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/orders" className="block text-base font-medium text-foreground hover:text-primary" onClick={toggleMobileMenu}>
                    My Orders
                  </Link>
                  <Link href="/dashboard" className="block text-base font-medium text-foreground hover:text-primary" onClick={toggleMobileMenu}>
                    Dashboard
                  </Link>
                  <button onClick={() => logout()} className="flex items-center gap-2 text-base font-medium text-destructive mt-4">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <a href="/api/login" className="block w-full text-center btn-primary py-3">
                  Sign In
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
