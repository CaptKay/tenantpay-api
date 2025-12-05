
export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthUserPayload {
    userId: string;
    orgId: string;
    role: "ADMIN" | "STAFF";
    fullName: string;
    staffId: string;
}

export interface LoginResponseDto {
    token: string;
    user: {
        id: string;
        email: string;
        fullName: string;
        staffId: string;
        role: "ADMIN" | "STAFF";
        orgId: string;
    };
}