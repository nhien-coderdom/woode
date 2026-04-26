import { useEffect, useState } from "react";
import { API_BASE_URL } from "../lib/api";

type BestSellingProduct = {
  id: number;
  name?: string;
};

export function useBestSellingProducts() {
  const [bestSellingProducts, setBestSellingProducts] = useState<BestSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE_URL}/products/best-selling`);

        if (!res.ok) {
          throw new Error("Failed to fetch best selling products");
        }

        const data = (await res.json()) as BestSellingProduct[];
        setBestSellingProducts(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSelling();
  }, []);

  return { bestSellingProducts, loading, error };
}