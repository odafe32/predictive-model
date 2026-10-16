import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalUsers,
    totalPredictions,
    totalLogs,
    predictions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.predictionResult.count(),
    prisma.systemLog.count(),
    prisma.predictionResult.findMany({
      select: {
        riskLevel: true,
        riskProbability: true,
        predictionDate: true,
        user: { select: { gender: true } },
      },
      orderBy: { predictionDate: "desc" },
      take: 500,
    }),
  ]);

  // Risk distribution
  const riskDistribution = {
    Low: predictions.filter((p) => p.riskLevel === "Low").length,
    Moderate: predictions.filter((p) => p.riskLevel === "Moderate").length,
    High: predictions.filter((p) => p.riskLevel === "High").length,
  };

  // Gender distribution
  const maleCount = predictions.filter((p) => p.user.gender === "Male").length;
  const femaleCount = predictions.filter((p) => p.user.gender === "Female").length;

  // Predictions over time (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentPredictions = predictions.filter(
    (p) => new Date(p.predictionDate) >= sevenDaysAgo
  );

  const dailyData: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStr = day.toISOString().split("T")[0];
    const count = recentPredictions.filter(
      (p) => new Date(p.predictionDate).toISOString().split("T")[0] === dayStr
    ).length;
    dailyData.push({
      date: day.toLocaleDateString("en-US", { weekday: "short" }),
      count,
    });
  }

  // Average risk probability
  const avgProbability =
    predictions.length > 0
      ? predictions.reduce((sum, p) => sum + Number(p.riskProbability), 0) / predictions.length
      : 0;

  return NextResponse.json({
    totalUsers,
    totalPredictions,
    totalLogs,
    riskDistribution,
    genderDistribution: { Male: maleCount, Female: femaleCount },
    dailyData,
    avgProbability: Math.round(avgProbability * 100) / 100,
  });
}
