import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { 
  products, orders, orderItems, 
  type Product, type InsertProduct,
  type Order, type OrderItem, type CreateOrderRequest 
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Orders
  createOrder(userId: string, request: CreateOrderRequest): Promise<Order>;
  getOrders(userId?: string): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;
  getOrder(id: number): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.id));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async createOrder(userId: string, request: CreateOrderRequest): Promise<Order> {
    // Calculate total amount
    let totalAmount = 0;
    const itemsWithPrice = [];

    for (const item of request.items) {
      const product = await this.getProduct(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      totalAmount += product.price * item.quantity;
      itemsWithPrice.push({ ...item, price: product.price });
    }

    // Start transaction ideally, but simple insert for now
    const [newOrder] = await db.insert(orders).values({
      buyerId: userId,
      totalAmount,
      deliveryAddress: request.deliveryAddress,
      status: "pending",
    }).returning();

    for (const item of itemsWithPrice) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    return newOrder;
  }

  async getOrders(userId?: string): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    let query = db.query.orders.findMany({
      orderBy: desc(orders.createdAt),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });

    if (userId) {
       // @ts-ignore - Drizzle findMany with where clause type complexity
       return await db.query.orders.findMany({
        where: eq(orders.buyerId, userId),
        orderBy: desc(orders.createdAt),
        with: {
          items: {
            with: {
              product: true
            }
          }
        }
       });
    }

    return await query;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [updatedOrder] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }
}

export const storage = new DatabaseStorage();
