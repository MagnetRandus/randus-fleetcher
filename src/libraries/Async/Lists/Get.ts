import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import IType_List from "./Lists.types";

export default async function ListsGet(context: WebPartContext): Promise<Array<IType_List>> {
    const siteUrl = `https://${location.hostname}/sites/fleet`;
    const endpoint = `${siteUrl}/_api/web/lists`;

    try {
        const response: SPHttpClientResponse = await context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);

        if (!response.ok) {
            throw new Error(`Error fetching content types: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data.value as IType_List[];


    } catch (err) {
        throw new Error(err)
    }
}

export async function ListsGetByGuid(context: WebPartContext, ListGuid: string): Promise<IType_List> {

    const siteUrl = `https://${location.hostname}/sites/fleet`;
    const endpoint = `${siteUrl}/_api/web/lists(guid'${ListGuid.replace('{', '').replace('}', '')}')`;

    try {
        const response: SPHttpClientResponse = await context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);

        if (!response.ok) {
            throw new Error(`Error fetching list: ${response.status} - ${response.statusText}`);
        }

        return await response.json();


    } catch (err) {
        throw new Error(err)
    }
}