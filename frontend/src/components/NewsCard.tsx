import OptimizedImage from "@/components/OptimizedImage";
import { Calendar, Clock } from "lucide-react";

interface NewsCardProps {
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  status?:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ARCHIVED"
    | "DRAFT"
    | "PUBLISHED"
    | "SCHEDULED"
    | "EXPIRED";
}

export default function NewsCard({
  title,
  content,
  imageUrl,
  createdAt,
  status = "PUBLISHED",
}: NewsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-700";
      case "DRAFT":
        return "bg-gray-100 text-gray-700";
      case "PUBLISHED":
        return "bg-green-100 text-green-700";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-700";
      case "EXPIRED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                status
              )}`}
            >
              {status}
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 overflow-hidden">
            {content.length > 200 ? content.substring(0, 200) + "..." : content}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {new Date(createdAt).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {imageUrl && (
          <div className="w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden">
            <OptimizedImage
              src={imageUrl}
              alt={title}
              width={160}
              height={160}
              className="w-full h-full object-cover"
              fallbackText="📰"
            />
          </div>
        )}
      </div>
    </div>
  );
}
