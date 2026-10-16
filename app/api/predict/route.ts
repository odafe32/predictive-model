import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getPrediction, type LifestyleInput } from "@/lib/ml-client";
import { lifestyleSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    // Authenticate
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input with Zod schema
    const parsed = lifestyleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const lifestyleInput: LifestyleInput = parsed.data;

    // Call ML service
    let prediction;
    try {
      prediction = await getPrediction(lifestyleInput);
    } catch (mlError) {
      console.error("ML service error:", mlError);
      return NextResponse.json(
        { error: "Prediction service is unavailable. Please try again later." },
        { status: 503 }
      );
    }

    // Save lifestyle data + prediction to database
    const lifestyleData = await prisma.lifestyleData.create({
      data: {
        userId: session.id,
        age: lifestyleInput.age,
        bmi: lifestyleInput.bmi,
        physicalActivity: lifestyleInput.physicalActivity,
        smokingStatus: lifestyleInput.smokingStatus,
        alcoholConsumption: lifestyleInput.alcoholConsumption,
        dietQuality: lifestyleInput.dietQuality,
        stressLevel: lifestyleInput.stressLevel,
        familyHistory: lifestyleInput.familyHistory,
        saltIntake: lifestyleInput.saltIntake,
        sleepHours: lifestyleInput.sleepHours,
        caffeineIntake: lifestyleInput.caffeineIntake,
      },
    });

    const predictionResult = await prisma.predictionResult.create({
      data: {
        userId: session.id,
        lifestyleId: lifestyleData.id,
        riskProbability: prediction.riskProbability,
        riskLevel: prediction.riskLevel,
      },
    });

    // Log activity
    await prisma.systemLog.create({
      data: {
        userId: session.id,
        activity: `Prediction: ${prediction.riskLevel} (${prediction.riskProbability}%)`,
        status: "Success",
      },
    });

    return NextResponse.json({
      id: predictionResult.id,
      riskProbability: prediction.riskProbability,
      riskLevel: prediction.riskLevel,
      lifestyleData: lifestyleInput,
      predictionDate: predictionResult.predictionDate,
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { error: "Failed to process prediction" },
      { status: 500 }
    );
  }
}
