export interface Donation {
    "@id"?: string;
    id?: number;
    fullName: string;
    originalAmount?: number;
    euroAmount?: number;
    originalCurrency?: string;
    withTeam?: boolean;
    team?: string;
    executedAt?: string;
    createdAt?: string;
}