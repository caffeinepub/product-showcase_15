import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, Product } from "../backend.d";
import { useActor } from "./useActor";

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    Order,
    Error,
    {
      productId: bigint;
      productName: string;
      customerName: string;
      contactNumber: string;
    }
  >({
    mutationFn: async ({
      productId,
      productName,
      customerName,
      contactNumber,
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitOrder(
        productId,
        productName,
        customerName,
        contactNumber,
        BigInt(Date.now()),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useGetAllOrders(adminPin: string, enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders", adminPin],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders(adminPin);
    },
    enabled: !!actor && !isFetching && enabled,
    retry: false,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    Product,
    Error,
    {
      name: string;
      description: string;
      price: string;
      imageUrl: string;
      adminPin: string;
    }
  >({
    mutationFn: async ({ name, description, price, imageUrl, adminPin }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addProduct(name, description, price, imageUrl, adminPin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
