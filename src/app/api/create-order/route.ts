import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay keys not configured" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Create Order Error:", error);

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}