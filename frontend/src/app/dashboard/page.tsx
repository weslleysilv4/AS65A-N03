"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuth";
import { useNews, usePendingChanges } from "@/hooks/useNews";
import { useNewsStats } from "@/hooks/useStats";
import Loading from "@/components/Loading";
import Sidebar from "@/components/Sidebar";
import NewsCard from "@/components/NewsCard";
import StatCard from "@/components/StatCard";
import { FileText, Eye, CheckCircle, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, isClient } = useAuthGuard();
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");

  const { data: news, isLoading: isNewsLoading } = useNews();
  const { data: pendingChanges, isLoading: isPendingLoading } =
    usePendingChanges();
  const { data: stats } = useNewsStats();

  if (!isClient || isLoading) {
    return <Loading message="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const recentNews =
    news
      ?.filter((item) => item.status === "PUBLISHED")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3) || [];

  const pendingNews =
    news?.filter((item) => item.status === "DRAFT").slice(0, 2) || [];

  const mockNewsData = [
    {
      id: "1",
      title: "ELLP Extension Project Update",
      text: "The ELLP Extension Project has reached a new milestone with the successful implementation of the pilot program in three additional schools. This expansion brings the total number of participating schools to ten, significantly increasing our reach and impact within the community.",
      imageUrl: "/dashboard/news-image-1.png",
      createdAt: new Date().toISOString(),
      status: "PUBLISHED" as const,
    },
    {
      id: "2",
      title: "ELLP Extension Project Update",
      text: "The ELLP Extension Project has reached a new milestone with the successful implementation of the pilot program in three additional schools. This expansion brings the total number of participating schools to ten, significantly increasing our reach and impact within the community.",
      imageUrl: "/dashboard/news-image-2.png",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: "PUBLISHED" as const,
    },
    {
      id: "3",
      title: "ELLP Extension Project Update",
      text: "The ELLP Extension Project has reached a new milestone with the successful implementation of the pilot program in three additional schools. This expansion brings the total number of participating schools to ten, significantly increasing our reach and impact within the community.",
      imageUrl: "/dashboard/news-image-3.png",
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      status: "PUBLISHED" as const,
    },
  ];

  const displayNews = recentNews.length > 0 ? recentNews : mockNewsData;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total de Notícias"
              value={stats?.totalNews || 0}
              icon={<FileText size={24} className="text-blue-600" />}
              color="bg-blue-50"
              change={12}
              changeType="increase"
            />
            <StatCard
              title="Publicadas"
              value={stats?.publishedNews || 0}
              icon={<CheckCircle size={24} className="text-green-600" />}
              color="bg-green-50"
              change={8}
              changeType="increase"
            />
            <StatCard
              title="Rascunhos"
              value={stats?.draftNews || 0}
              icon={<Eye size={24} className="text-yellow-600" />}
              color="bg-yellow-50"
              change={-5}
              changeType="decrease"
            />
            <StatCard
              title="Pendentes"
              value={pendingChanges?.length || 0}
              icon={<AlertCircle size={24} className="text-red-600" />}
              color="bg-red-50"
              change={3}
              changeType="increase"
            />
          </div>

          {/* Pending Review Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Pending Review
            </h2>
            <div className="space-y-4">
              {isNewsLoading || isPendingLoading ? (
                <Loading message="Carregando notícias pendentes..." />
              ) : pendingNews.length > 0 ? (
                pendingNews.map((item) => (
                  <NewsCard
                    key={item.id}
                    title={item.title}
                    content={item.text}
                    imageUrl={item.imageUrl}
                    createdAt={item.createdAt}
                    status={item.status}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <p className="text-gray-500">
                    Nenhuma notícia pendente para revisão
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent News Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent News
            </h2>
            <div className="space-y-4">
              {isNewsLoading ? (
                <Loading message="Carregando notícias recentes..." />
              ) : (
                displayNews.map((item) => (
                  <NewsCard
                    key={item.id}
                    title={item.title}
                    content={item.text}
                    imageUrl={item.imageUrl}
                    createdAt={item.createdAt}
                    status={item.status}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
