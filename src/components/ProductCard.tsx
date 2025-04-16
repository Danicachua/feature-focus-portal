
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  name: string;
  description: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  price: number;
  image: string;
}

export function ProductCard({ name, description, status, price, image }: ProductCardProps) {
  const statusColor = {
    "In Stock": "bg-green-100 text-green-700",
    "Low Stock": "bg-yellow-100 text-yellow-700",
    "Out of Stock": "bg-red-100 text-red-700"
  }[status];

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video w-full bg-gray-100">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg">{name}</h3>
          <Badge className={statusColor}>{status}</Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold">${price}</span>
          <button className="text-sm text-purple-500 hover:text-purple-600">View Details →</button>
        </div>
      </div>
    </Card>
  );
}
