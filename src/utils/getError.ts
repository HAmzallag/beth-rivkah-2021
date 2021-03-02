import type { AxiosError } from "axios";

export function getError({ response, message }: AxiosError) {
    return (
        response?.data?.detail ??
        response?.data?.["hydra:description"] ??
        response?.data?.message ??
        message
    );
}
