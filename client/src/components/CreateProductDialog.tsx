import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type InsertProduct } from "@shared/schema";
import { useCreateProduct } from "@/hooks/use-products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";

const formSchema = insertProductSchema.extend({
  price: z.coerce.number(),
  stock: z.coerce.number(),
});

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { mutate: createProduct, isPending } = useCreateProduct();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InsertProduct>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sellerId: user?.id,
      category: "Flower",
      imageUrl: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=800&q=80", // Default placeholder
    }
  });

  const onSubmit = (data: InsertProduct) => {
    createProduct(data, {
      onSuccess: () => {
        toast({ title: "Success", description: "Product created successfully" });
        setOpen(false);
        reset();
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> New Product
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Add Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <input type="hidden" {...register("sellerId")} value={user?.id} />
          
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" {...register("name")} className="input-field" placeholder="Purple Haze" />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (KSH)</Label>
              <Input id="price" type="number" {...register("price")} className="input-field" placeholder="1500" />
              {errors.price && <span className="text-red-500 text-xs">{errors.price.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" {...register("stock")} className="input-field" placeholder="100" />
              {errors.stock && <span className="text-red-500 text-xs">{errors.stock.message}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" {...register("category")} className="input-field w-full">
              <option value="Flower">Flower</option>
              <option value="Edible">Edible</option>
              <option value="Vape">Vape</option>
              <option value="Concentrate">Concentrate</option>
              <option value="Accessory">Accessory</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <div className="relative">
              <Input id="imageUrl" {...register("imageUrl")} className="input-field pl-10" placeholder="https://..." />
              <ImageIcon className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
            </div>
            {errors.imageUrl && <span className="text-red-500 text-xs">{errors.imageUrl.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} className="min-h-[100px] resize-none border-input rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Describe the strain, effects, etc..." />
            {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
          </div>

          <Button type="submit" disabled={isPending} className="w-full btn-primary h-12">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Create Product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
