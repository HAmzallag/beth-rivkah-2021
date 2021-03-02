import axios, {
    AxiosError,
    AxiosRequestConfig,
    AxiosPromise,
    AxiosTransformer,
} from "axios";
import { push } from "svelte-spa-router";
import { notifier } from "@beyonk/svelte-notifications";
import { getError } from "./getError";

const jsonLdMimeType: string = "application/ld+json";

let authorizationHeader: string | null = null;

export function setAuthorizationHeader(token?: string) {
    authorizationHeader = token ? `Bearer ${token}` : null;
}

const apiInstance = axios.create({
    //@ts-ignore
    baseURL: appEnv.env.API_URL,
});

apiInstance.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
        const msg = getError(error);
        if (
            error?.response?.status === 401 &&
            [
                "Expired JWT Token",
                "JWT Token not found",
                "Invalid JWT Token",
            ].indexOf(msg) !== -1
        ) {
            push("/admin/login");
            notifier.info("Sécurité : merci de bien vouloir vous reconnecter.");
            return;
        } else {
            notifier.danger(msg);
        }
        return Promise.reject(error);
    }
);

const stringifyDate: AxiosTransformer = (
    data: { [key: string]: any } | null
) => {
    if (data && typeof data === "object") {
        Object.keys(data).forEach((k) => {
            const d = data[k];
            if (d instanceof Date) {
                data[k] = d.toISOString();
            }
        });
        return JSON.stringify(data);
    }
    return data;
};

export function api<T = any>(
    url: string,
    options: AxiosRequestConfig = {}
): AxiosPromise<T> {
    if (url == null) {
        throw Error("L'URL ne doit pas être null.");
    }

    if (options.headers == null) {
        options.headers = {};
    }
    if (undefined === options.headers.Accept) {
        options.headers.Accept = jsonLdMimeType;
    }
    options.headers["Authorization"] = authorizationHeader;

    if (options.method === "PATCH" || options.method === "patch") {
        options.headers["Content-Type"] = "application/merge-patch+json";
    } else if (
        options.data != null &&
        !(options.data instanceof FormData) &&
        options.headers["Content-Type"] == null
    ) {
        options.headers["Content-Type"] = jsonLdMimeType;
    }
    if (options.transformRequest) {
        options.transformRequest = [
            options.transformRequest,
            stringifyDate,
        ] as AxiosTransformer[];
    } else if (options.data == null || !(options.data instanceof FormData)) {
        options.transformRequest = stringifyDate;
    }

    options.url = url.replace("/api/public", "");

    return apiInstance.request(options);
}
