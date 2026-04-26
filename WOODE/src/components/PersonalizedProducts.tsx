import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import FurnitureCard from "./FurnitureCard";
import { useNavigate } from "react-router-dom";

interface PersonalizedProduct {
  productId: number;
  productName: string;
  imageUrl: string | null;
  currentPrice: number;
  favoriteScore: number;
}

interface PersonalizedData {
  favorites: PersonalizedProduct[];
  recentlyOrdered: PersonalizedProduct[];
  frequentlyOrdered: PersonalizedProduct[];
}

export default function PersonalizedProducts() {
  const [data, setData] = useState<PersonalizedData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonalizedData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/users/me/personalized`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch personalized data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalizedData();
  }, []);

  if (loading) return null;
  if (!data || data.favorites.length === 0) return null;

  return (
    <div className="w-full mb-12 mt-12 border-t border-[#3A3A3A] pt-10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0EB]">
          Gợi ý dành riêng cho bạn
        </h3>
      </div>

      <div className="sm:grid-cols-3 md:grid-cols-4 gap-6 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {data.favorites.map((product) => (
          <div
            key={product.productId}
            onClick={() => navigate(`/product/${product.productId}`)}
            className="cursor-pointer"
          >
            <FurnitureCard
              name={product.productName}
              image={product.imageUrl || ""}
              price={product.currentPrice}
              isActive={true}
              isBestSeller={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
