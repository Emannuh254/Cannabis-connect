import { Navbar } from "@/components/Navbar";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Truck, ShieldCheck, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
           {/* Abstract background blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
                <Leaf className="w-4 h-4" /> 
                Premium Quality Cannabis
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.1] mb-6">
                GreenDrop <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                  Delivery
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Connect with trusted local sellers. Fast, discreet, and secure delivery straight to your doorstep.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="btn-primary h-14 text-lg px-8">
                  Shop Now
                </Link>
                <Link href="/api/login" className="btn-secondary h-14 text-lg px-8">
                  Seller Login
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Verified Sellers
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" /> Fast Delivery
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Landing Page Hero Scenic Mountain Landscape - implies natural/organic */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50">
                 <img 
                   src="https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=1200&h=800&fit=crop" 
                   alt="Premium Cannabis"
                   className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">100% Secure</p>
                    <p className="text-muted-foreground text-sm">Discreet Packaging</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Why Choose GreenDrop?</h2>
            <p className="text-muted-foreground">We prioritize quality, speed, and privacy above all else.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="w-8 h-8 text-primary" />,
                title: "Premium Quality",
                desc: "Sourced from the best local growers with verified lab results."
              },
              {
                icon: <Truck className="w-8 h-8 text-primary" />,
                title: "Fast Delivery",
                desc: "Get your order delivered in under 60 minutes within city limits."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-primary" />,
                title: "Secure & Private",
                desc: "Your data is encrypted and packages are completely discreet."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
