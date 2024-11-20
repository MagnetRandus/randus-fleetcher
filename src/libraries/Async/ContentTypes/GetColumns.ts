import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import IType_Columns from "./Column.types";

export default async function GetColumns(context: WebPartContext, ListGuid: string, ContentTypeId: string): Promise<IType_Columns[]> {
    const siteUrl = `https://${location.hostname}/sites/fleet/`;

    const fieldsEndpoint = `${siteUrl}_api/web/lists(guid'${ListGuid}')/contenttypes('${ContentTypeId}')/fields`; // Endpoint for fields

    const fieldsResponse: SPHttpClientResponse = await context.spHttpClient.get(fieldsEndpoint, SPHttpClient.configurations.v1);

    if (!fieldsResponse.ok) {
        throw new Error(`Error fetching fields for content type ${ContentTypeId}: ${fieldsResponse.status} - ${fieldsResponse.statusText}`);
    }

    const fieldsData = await fieldsResponse.json();
    return fieldsData.value;
}