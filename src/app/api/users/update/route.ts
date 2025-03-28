import { connect } from "@/lib/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    foundUser.count = foundUser.count + 18;
    await foundUser.save();

    return NextResponse.json(foundUser, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 },
    );
  }
}
