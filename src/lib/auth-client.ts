
// Mock Auth Service for UI development
export async function sendOtp({ email }: { email: string }) {
    console.log("Sending OTP to", email);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { kind: "success" };
}

export async function login({ email, otp }: { email: string, otp: string }) {
    console.log("Logging in with", email, otp);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (otp === "123456") {
        return { kind: "success" };
    }
    // Return success for any OTP for development simplicity unless specifically testing error
    return { kind: "success" };
}

export async function googleLogin({ clientId, credential }: { clientId: string, credential: string, select_by: string }) {
    console.log("Google Login", clientId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { kind: "success" };
}
