import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ShoppingBag, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useGetProducts, useSubmitOrder } from "../hooks/useQueries";

/* ── Sample seed products shown before backend loads ── */
const SEED_PRODUCTS: Product[] = [
  {
    id: BigInt(1),
    name: "Artisan Ceramic Bowl Set",
    description:
      "Hand-thrown stoneware bowls with a speckled glaze finish. Each piece is unique and food-safe, perfect for everyday dining.",
    price: "₹1,499",
    imageUrl: "/assets/generated/product-ceramics.dim_400x300.jpg",
  },
  {
    id: BigInt(2),
    name: "Handcrafted Leather Wallet",
    description:
      "Full-grain vegetable-tanned leather bifold wallet. Slim profile with 6 card slots and a cash compartment.",
    price: "₹2,299",
    imageUrl: "/assets/generated/product-leather.dim_400x300.jpg",
  },
  {
    id: BigInt(3),
    name: "Botanical Beeswax Candles",
    description:
      "Pure beeswax candles infused with dried wildflowers and essential oils. Burns cleanly for 40+ hours.",
    price: "₹849",
    imageUrl: "/assets/generated/product-candles.dim_400x300.jpg",
  },
  {
    id: BigInt(4),
    name: "Woven Macramé Wall Art",
    description:
      "Hand-knotted macramé wall hanging in 100% natural cotton rope. Adds warmth to any living space.",
    price: "₹1,899",
    imageUrl: "/assets/generated/product-macrame.dim_400x300.jpg",
  },
  {
    id: BigInt(5),
    name: "Cold-Pressed Olive Oil",
    description:
      "Single-origin extra virgin olive oil from small family farms. Rich, fruity flavour with a peppery finish.",
    price: "₹699",
    imageUrl: "/assets/generated/product-oliveoil.dim_400x300.jpg",
  },
  {
    id: BigInt(6),
    name: "Carved Walnut Cutting Board",
    description:
      "Solid walnut wood with hand-carved geometric inlay. Food-safe oil finish. A lifetime kitchen companion.",
    price: "₹3,199",
    imageUrl: "/assets/generated/product-woodwork.dim_400x300.jpg",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

interface OrderFormState {
  customerName: string;
  contactNumber: string;
}

export function HomePage() {
  const { data: backendProducts, isLoading } = useGetProducts();
  const submitOrderMutation = useSubmitOrder();

  const products =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : SEED_PRODUCTS;

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<OrderFormState>({
    customerName: "",
    contactNumber: "",
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");

  const openOrderDialog = (product: Product) => {
    setSelectedProduct(product);
    setForm({ customerName: "", contactNumber: "" });
    setOrderSuccess(false);
    setOrderError("");
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setIsDialogOpen(false);
      setSelectedProduct(null);
      setOrderSuccess(false);
      setOrderError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setOrderError("");
    setOrderSuccess(false);

    try {
      await submitOrderMutation.mutateAsync({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        customerName: form.customerName.trim(),
        contactNumber: form.contactNumber.trim(),
      });
      setOrderSuccess(true);
      toast.success("Order placed! We'll contact you soon.");
    } catch {
      setOrderError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 60% 50%, oklch(0.75 0.12 60 / 0.35) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 10% 20%, oklch(0.52 0.16 40 / 0.15) 0%, transparent 60%)",
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
          <div className="py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                Handpicked Collection
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-4">
                Crafted with
                <br />
                <em className="not-italic text-primary">care & heart.</em>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-lg">
                Discover a curated collection of handmade products. See
                something you love? Place your order and we'll get in touch
                directly.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Direct seller · No middlemen · Personal service
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Our Products
            </h2>
            <span className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${products.length} items`}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(["a", "b", "c", "d", "e", "f"] as const).map((id) => (
                <div
                  key={id}
                  className="space-y-3"
                  data-ocid="products.loading_state"
                >
                  <Skeleton className="w-full h-52 rounded-xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products.map((product, index) => (
                <motion.div
                  key={String(product.id)}
                  variants={cardVariants}
                  data-ocid={`product.item.${index + 1}`}
                >
                  <ProductCard
                    product={product}
                    orderIndex={index + 1}
                    onOrderClick={() => openOrderDialog(product)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && products.length === 0 && (
            <div
              data-ocid="products.empty_state"
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No products yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Products will appear here once they're added by the shop owner.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Order Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md" data-ocid="order.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Place Your Order
            </DialogTitle>
            {selectedProduct && (
              <DialogDescription className="flex items-center gap-1.5 mt-1">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span>
                  <strong className="text-foreground">
                    {selectedProduct.name}
                  </strong>{" "}
                  — {selectedProduct.price}
                </span>
              </DialogDescription>
            )}
          </DialogHeader>

          {orderSuccess ? (
            <div
              data-ocid="order.success_state"
              className="py-8 text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <svg
                  className="w-7 h-7 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-label="Success checkmark"
                  role="img"
                >
                  <title>Success checkmark</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Order Placed!
              </h3>
              <p className="text-sm text-muted-foreground">
                Thank you! We will contact you soon.
              </p>
              <Button
                variant="outline"
                onClick={() => handleDialogClose(false)}
                className="mt-2"
                data-ocid="order.close_button"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="customerName"
                  data-ocid="order.name_input"
                  placeholder="Enter your full name"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      customerName: e.target.value,
                    }))
                  }
                  required
                  autoComplete="name"
                  className="bg-secondary/50 border-border focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber" className="text-sm font-medium">
                  Contact Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactNumber"
                  data-ocid="order.contact_input"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.contactNumber}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      contactNumber: e.target.value,
                    }))
                  }
                  required
                  autoComplete="tel"
                  className="bg-secondary/50 border-border focus-visible:ring-primary"
                />
              </div>

              {orderError && (
                <p
                  data-ocid="order.error_state"
                  className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
                >
                  {orderError}
                </p>
              )}

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogClose(false)}
                  data-ocid="order.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="order.submit_button"
                  disabled={submitOrderMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {submitOrderMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {submitOrderMutation.isPending
                    ? "Placing Order..."
                    : "Confirm Order"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ProductCardProps {
  product: Product;
  orderIndex: number;
  onOrderClick: () => void;
}

function ProductCard({ product, orderIndex, onOrderClick }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const fallbackUrl = `https://placehold.co/400x300?text=${encodeURIComponent(product.name)}`;

  return (
    <Card className="group flex flex-col overflow-hidden border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-card">
      <div className="relative overflow-hidden aspect-[4/3] bg-muted">
        <img
          src={imgError ? fallbackUrl : product.imageUrl || fallbackUrl}
          alt={product.name}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardHeader className="pb-2 pt-4 px-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-card-foreground line-clamp-1">
          {product.name}
        </h3>
      </CardHeader>
      <CardContent className="px-4 pb-3 flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="px-4 pb-4 flex items-center justify-between gap-3">
        <span className="font-display text-xl font-bold text-primary">
          {product.price}
        </span>
        <Button
          onClick={onOrderClick}
          data-ocid={`product.order_button.${orderIndex}`}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          size="sm"
        >
          <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
          Order Now
        </Button>
      </CardFooter>
    </Card>
  );
}
