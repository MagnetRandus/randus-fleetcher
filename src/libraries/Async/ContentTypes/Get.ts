import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import IType_ContentType from "./ContentType.types";

export default async function ContentTypesGet(context: WebPartContext, ListGuid: string): Promise<Array<IType_ContentType>> {
    const siteUrl = `https://${location.hostname}/sites/fleet`;
    const contentTypesEndpoint = `${siteUrl}/_api/web/lists(guid'${ListGuid}')/contenttypes`;

    try {
        const response: SPHttpClientResponse = await context.spHttpClient.get(contentTypesEndpoint, SPHttpClient.configurations.v1);

        if (!response.ok) {
            throw new Error(`Error fetching content types: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data.value as IType_ContentType[];

    } catch (err) {
        throw new Error(err)
    }
}