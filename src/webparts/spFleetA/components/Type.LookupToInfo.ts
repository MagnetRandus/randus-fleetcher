export default interface IType_LookupToInfo {
    '@odata.context': string;
    '@odata.type': string;
    '@odata.id': string;
    '@odata.editLink': string;
    LookupField: string;
    LookupList: string;
}

export interface IType_LookupToInfoWithListName extends IType_LookupToInfo {
    ListName: string;
}