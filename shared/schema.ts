export * from "./models/auth";
import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in KSH
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  stock: integer("stock").default(0).notNull(),
  sellerId: varchar("seller_id").notNull(), // links to users.id
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  buyerId: varchar("buyer_id").notNull(), // links to users.id
  totalAmount: integer("total_amount").notNull(),
  status: text("status").default("pending").notNull(), // pending, paid, delivered, cancelled
  deliveryAddress: text("delivery_address").notNull(),
  paymentRef: text("payment_ref"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});

export const productsRelations = relations(products, ({ one }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  buyer: one(users, {
    fields: [orders.buyerId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const insertProductSchema = createInsertSchema(products).omit({ id: true });

export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// API Types
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1),
  })),
  deliveryAddress: z.string().min(5),
});

export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
