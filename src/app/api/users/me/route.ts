import { connect } from "@/lib/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
      const { email } = await request.json();
      console.log("Email is ", email);
      
      const foundUser = await User.findOne({ email });
      if (foundUser) {
        return NextResponse.json(foundUser, { status: 200 });
      }
  
      const newUser = new User({
        email,
        count: 0,
      });
  
      const savedUser = await newUser.save();

      return NextResponse.json(
        { savedUser, message: "User created successfully", success: true },
        { status: 200 },
      );
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