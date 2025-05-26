import { connect } from "@/lib/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

// Enable caching for 1 hour
export const revalidate = 3600;

connect();

export async function GET() {
  try {
    // Get top 10 users
    const topUsers = await User.find({})
      .sort({ navarnaCount: -1 })
      .limit(5)
      .lean();

    // Get total japa count from all users
    const result = await User.aggregate([
      {
        $group: {
          _id: null,
          totalJapa: { $sum: "$navarnaCount" },
          userCount: { $sum: 1 }
        }
      }
    ]);

    const totalJapa = result[0]?.totalJapa || 0;
    const totalUsers = result[0]?.userCount || 0;

    const rankedUsers = topUsers.map((user, index) => ({
      email: user.email.replace('@gmail.com', ''),
      navarnaCount: user.navarnaCount,
      rank: index + 1,
    }));

    return NextResponse.json({
      totalJapa,
      totalUsers,
      topUsers: rankedUsers
    });
  } catch (error) {
    console.error("Error fetching top users:", error);
    return NextResponse.json(
      { error: "Failed to fetch top users" },
      { status: 500 }
    );
  }
}
