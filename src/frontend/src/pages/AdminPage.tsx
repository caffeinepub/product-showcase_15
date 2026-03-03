import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Lock,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddProduct, useGetAllOrders } from "../hooks/useQueries";

const ADMIN_PIN = "1234";

interface AddProductForm {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export function AdminPage() {
  const [pinInput, setPinInput] = useState("");
  const [verifiedPin, setVerifiedPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const isAuthenticated = !!verifiedPin;

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
    refetch,
  } = useGetAllOrders(verifiedPin, isAuthenticated);

  const [addForm, setAddForm] = useState<AddProductForm>({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [addSuccess, setAddSuccess] = useState(false);

  const addProductMutation = useAddProduct();

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    setIsVerifying(true);

    await new Promise((r) => setTimeout(r, 600)); // feel deliberate

    if (pinInput.trim() === ADMIN_PIN) {
      setVerifiedPin(pinInput.trim());
    } else {
      setPinError("Incorrect PIN. Please try again.");
    }
    setIsVerifying(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddSuccess(false);
    try {
      await addProductMutation.mutateAsync({
        name: addForm.name.trim(),
        description: addForm.description.trim(),
        price: addForm.price.trim(),
        imageUrl: addForm.imageUrl.trim(),
        adminPin: verifiedPin,
      });
      toast.success("Product added successfully!");
      setAddSuccess(true);
      setAddForm({ name: "", description: "", price: "", imageUrl: "" });
    } catch {
      toast.error("Failed to add product. Please try again.");
    }
  };

  const formatTimestamp = (ts: bigint) => {
    const date = new Date(Number(ts));
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ── PIN Screen ── */
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Card className="shadow-card-hover border-border">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">
                Admin Access
              </CardTitle>
              <CardDescription>
                Enter your PIN to view orders and manage products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pin" className="text-sm font-medium">
                    Admin PIN
                  </Label>
                  <Input
                    id="pin"
                    data-ocid="admin.pin_input"
                    type="password"
                    placeholder="Enter PIN"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError("");
                    }}
                    required
                    autoFocus
                    className="text-center tracking-[0.5em] text-lg bg-secondary/50"
                    maxLength={8}
                  />
                </div>

                {pinError && (
                  <p
                    data-ocid="admin.error_state"
                    className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg text-center"
                  >
                    {pinError}
                  </p>
                )}

                <Button
                  type="submit"
                  data-ocid="admin.view_orders_button"
                  disabled={isVerifying || !pinInput}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    "View Orders"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  /* ── Admin Dashboard ── */
  return (
    <div className="py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage orders and products
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <Card className="shadow-card border-border">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-display text-lg">
                    Customer Orders
                  </CardTitle>
                  <CardDescription>
                    {ordersLoading
                      ? "Loading orders…"
                      : `${orders?.length ?? 0} total orders`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {ordersLoading ? (
                <div className="p-6 space-y-3" data-ocid="admin.loading_state">
                  {(["a", "b", "c", "d"] as const).map((id) => (
                    <div key={id} className="flex gap-4">
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              ) : ordersError ? (
                <div
                  data-ocid="admin.error_state"
                  className="py-12 text-center text-sm text-destructive"
                >
                  Failed to load orders. Please refresh or re-enter your PIN.
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.orders_table">
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="font-semibold text-foreground">
                          Customer Name
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          Contact Number
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          Product
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          Date & Time
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order, index) => (
                        <TableRow
                          key={String(order.id)}
                          data-ocid={`admin.orders.row.${index + 1}`}
                          className="border-border"
                        >
                          <TableCell className="font-medium text-foreground">
                            {order.customerName}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono">
                            {order.contactNumber}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              <Package className="w-3 h-3" />
                              {order.productName}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(order.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div
                  data-ocid="admin.orders.empty_state"
                  className="py-16 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground text-sm">
                    No orders yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Orders will appear here when customers place them.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <Separator />

        {/* Add Product */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <Card className="shadow-card border-border">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Plus className="w-4.5 h-4.5 text-primary" />
                Add New Product
              </CardTitle>
              <CardDescription>
                Fill in the details below to add a new product to your shop.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddProduct} className="space-y-5 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="productName"
                      className="text-sm font-medium"
                    >
                      Product Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="productName"
                      data-ocid="admin.product.name_input"
                      placeholder="e.g. Handmade Ceramic Mug"
                      value={addForm.name}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="productPrice"
                      className="text-sm font-medium"
                    >
                      Price <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="productPrice"
                      data-ocid="admin.product.input"
                      placeholder="e.g. ₹499"
                      value={addForm.price}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      required
                      className="bg-secondary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="productDescription"
                    className="text-sm font-medium"
                  >
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="productDescription"
                    data-ocid="admin.product.textarea"
                    placeholder="Describe the product — materials, dimensions, usage…"
                    value={addForm.description}
                    onChange={(e) =>
                      setAddForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                    rows={3}
                    className="bg-secondary/50 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productImage" className="text-sm font-medium">
                    Image URL
                  </Label>
                  <Input
                    id="productImage"
                    data-ocid="admin.product.image_input"
                    type="url"
                    placeholder="https://example.com/product-image.jpg"
                    value={addForm.imageUrl}
                    onChange={(e) =>
                      setAddForm((prev) => ({
                        ...prev,
                        imageUrl: e.target.value,
                      }))
                    }
                    className="bg-secondary/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank to use a placeholder image.
                  </p>
                </div>

                {addSuccess && (
                  <p
                    data-ocid="admin.product.success_state"
                    className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg"
                  >
                    ✓ Product added successfully!
                  </p>
                )}

                {addProductMutation.isError && (
                  <p
                    data-ocid="admin.product.error_state"
                    className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
                  >
                    Failed to add product. Please try again.
                  </p>
                )}

                <Button
                  type="submit"
                  data-ocid="admin.add_product_button"
                  disabled={addProductMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {addProductMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Product…
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
