import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./replit_integrations/auth";
import { registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);

  // API Routes
  
  // Products
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.products.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      // Ensure user is seller or admin? For MVP, any logged in user can sell?
      // Or auto-set sellerId to current user
      const productData = { ...input, sellerId: (req.user as any).claims.sub };
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Orders
  app.post(api.orders.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      const order = await storage.createOrder(userId, input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.orders.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    // If admin, show all? For now just show user's orders
    const orders = await storage.getOrders(userId);
    res.json(orders);
  });

  app.patch(api.orders.updateStatus.path, isAuthenticated, async (req, res) => {
    try {
       // Validate user is admin?
       const status = req.body.status;
       const orderId = Number(req.params.id);
       const order = await storage.updateOrderStatus(orderId, status);
       res.json(order);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Seed Data
  seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const products = await storage.getProducts();
  if (products.length === 0) {
    console.log("Seeding database...");
    const dummySellerId = "seed-seller-1"; // Won't link to real user but works for display
    
    await storage.createProduct({
      name: "Blue Dream",
      description: "A sativa-dominant hybrid marijuana strain made by crossing Blueberry with Haze.",
      price: 1500,
      imageUrl: "https://images.leafly.com/flower-images/blue-dream.png?auto=compress,format&w=350&dpr=1",
      category: "Hybrid",
      stock: 100,
      sellerId: dummySellerId,
    });

    await storage.createProduct({
      name: "OG Kush",
      description: "A legendary strain with a distinct aroma and strong effects.",
      price: 1800,
      imageUrl: "https://images.leafly.com/flower-images/og-kush.png?auto=compress,format&w=350&dpr=1",
      category: "Hybrid",
      stock: 50,
      sellerId: dummySellerId,
    });

    await storage.createProduct({
      name: "Sour Diesel",
      description: "A popular sativa strain known for its pungent diesel-like scent.",
      price: 1600,
      imageUrl: "https://images.leafly.com/flower-images/sour-diesel.png?auto=compress,format&w=350&dpr=1",
      category: "Sativa",
      stock: 75,
      sellerId: dummySellerId,
    });
    
    await storage.createProduct({
        name: "Granddaddy Purple",
        description: "A famous indica cross of Mendo Purps, Skunk, and Afghanistan.",
        price: 1700,
        imageUrl: "https://images.leafly.com/flower-images/granddaddy-purple.png?auto=compress,format&w=350&dpr=1",
        category: "Indica",
        stock: 60,
        sellerId: dummySellerId,
    });
  }
}
