import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { username, firstName, lastName, email, password } = await req.json();

    if (!username || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Secondary layer of defense: Reserved usernames
    const reservedUsernames = ["admin", "api", "login", "register", "dashboard", "portfolio", "platform"];
    if (reservedUsernames.includes(username.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "This username is reserved and cannot be used" },
        { status: 400 }
      );
    }

    // Check if user or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const errorMsg = existingUser.email === email 
        ? "User with this email already exists" 
        : "Username is already taken";
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { success: true, data: { id: user._id, fullName: user.fullName, email: user.email, username: user.username } },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
