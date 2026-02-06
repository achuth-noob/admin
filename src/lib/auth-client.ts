import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function sendOtp({ email }: { email: string }) {
    try {
        await axios.post(`${API_URL}/admin/generate-and-send-otp-to-email`, null, {
            params: { admin_email: email }
        });
        return { kind: "success" };
    } catch (error: any) {
        console.error("Send OTP error:", error);
        return { 
            kind: "error", 
            message: error.response?.data?.detail || error.message || "Failed to send OTP" 
        };
    }
}

export async function login({ email, otp }: { email: string, otp: string }) {
    try {
        const response = await axios.post(`${API_URL}/admin/verify-otp-for-login`, {
            email: email,
            otp: parseInt(otp, 10)
        });

        const { access_token, admin_id } = response.data.dataResponse;

        if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("adminId", admin_id);
            localStorage.setItem("userEmail", email);
        }

        return { kind: "success" };
    } catch (error: any) {
        console.error("Login error:", error);
        return { 
            kind: "error", 
            message: error.response?.data?.detail || error.message || "Login failed" 
        };
    }
}

export async function googleLogin({ clientId, credential }: { clientId: string, credential: string, select_by: string }) {
    // There is no admin google login endpoint identified yet.
    // Keeping mock for now or ignoring.
    console.warn("Google login not implemented for Admin console");
    return { kind: "error", message: "Google login not supported for Admins yet." };
}
