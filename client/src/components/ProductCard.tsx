import type { Product } from "@shared/schema";
import { ShoppingCart, Plus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart.`,
      duration: 2000,
    });
  };

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-bold text-lg text-foreground line-clamp-1">{product.name}</h3>
          <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
            {product.category}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-lg font-bold text-primary">
            {product.price} KSH
          </span>
          <span className={`text-xs font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
}
