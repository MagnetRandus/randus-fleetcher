import IType_Columns from "@Async/ContentTypes/Column.types";
import { ListsGetByGuid } from "@Async/Lists/Get";
import RequestRaw from "@Async/RawRequest";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import IType_OdataId_Resolved from "src/webparts/spFleetA/components/ODataId.type";
import IType_LookupToInfo, { IType_LookupToInfoWithListName } from "src/webparts/spFleetA/components/Type.LookupToInfo";

// interface RootObject {
//     '@odata.context': string;
//     '@odata.type': string;
//     '@odata.id': string;
//     '@odata.editLink': string;
// }

export default async function GetLookupInfo(context: WebPartContext, j: IType_Columns): Promise<IType_LookupToInfoWithListName> {

    const odataId = j["@odata.id"];
    const jResponse = await RequestRaw<IType_OdataId_Resolved>(context, odataId);
    //https://atarendt.sharepoint.com/sites/fleet/_api/Web/Lists(guid'70b84dfb-a559-4288-91f2-13cfc86601b3')/Fields(guid'97244d8b-d473-4e58-b0b3-f47c4e167039')
    // console.log(`jResponse`);
    // console.log(jResponse)

    const q = `${jResponse["@odata.id"]}?$select=LookupList,LookupField`;

    const kResponse = await RequestRaw<IType_LookupToInfo>(context, q)
    console.log(JSON.stringify(kResponse));
    const lstInfo = await ListsGetByGuid(context, kResponse.LookupList);

    const lookupToInfoWithListName: IType_LookupToInfoWithListName = {
        ...kResponse,
        ListName: lstInfo.Title, // Add the resolved list name here
    };
    return lookupToInfoWithListName;
}