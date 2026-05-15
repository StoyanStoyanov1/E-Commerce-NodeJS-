export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "ADMIN" | "CUSTOMER" | "SELLER" | "MODERATOR";
    isAktiv: boolean;
}