export interface Role {
    id: string;
    name: string;
    normalizedName: string;
    concurrencyStamp: string;
}

export interface Profile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string
    role?: Role
}