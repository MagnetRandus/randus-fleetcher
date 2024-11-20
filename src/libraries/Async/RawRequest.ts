import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export default async function RequestRaw<T>(context: WebPartContext, url: string): Promise<T> {
    const fieldsResponse: SPHttpClientResponse = await context.spHttpClient.get(url, SPHttpClient.configurations.v1);

    if (!fieldsResponse.ok) {
        throw new Error(`Error fetching url ${url}`);
    }

    return await fieldsResponse.json();
}