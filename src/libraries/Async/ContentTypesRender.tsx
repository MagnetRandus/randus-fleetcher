// import IType_Columns from "@Async/ContentTypes/Column.types";
// import IType_ContentType from "@Async/ContentTypes/ContentType.types";
// import GetColumns from "@Async/ContentTypes/GetColumns";
// import { Dropdown, IDropdownOption, Stack } from "@fluentui/react";
// import { WebPartContext } from "@microsoft/sp-webpart-base";
// import * as React from "react";

// interface IPropsContentTypeRender {
//   context: WebPartContext;
//   ContentTypeNames: Array<IType_ContentType>;
//   setColumnValues: (values: IType_Columns[]) => void;
// }

// const ContentTypeRender: React.FC<IPropsContentTypeRender> = ({
//   context,
//   ContentTypeNames,
//   setColumnValues,
// }) => {
//   const options: IDropdownOption[] = ContentTypeNames.map((j) => {
//     return {
//       key: String(j.Id.StringValue),
//       text: String(j.Name),
//     };
//   });

//   const ctypeClick = (
//     ev: React.FormEvent<HTMLDivElement>,
//     value: IDropdownOption<unknown> | undefined //IType_ContentType
//   ): void => {
//     if (value) {
//       GetColumns(context, String(value.key))
//         .then((response) => {
//           setColumnValues(response);
//           console.log(`Column Names:`);
//           response.forEach((value, index) => {
//             console.log(
//               `${value.InternalName} - ${value.TypeAsString} - ${value.FieldTypeKind}`
//             );
//           });
//         })
//         .catch((err) => console.error(err));
//     }
//   };
//   return (
// <Stack tokens={{ childrenGap: 5 }}>
//   <Stack>
//     {ContentTypeNames.length !== 0 && (
//       <Dropdown
//         placeholder="Select an option"
//         label="Select a Content Type"
//         options={options}
//         onChange={(event, option) => ctypeClick(event, option)}
//       />
//     )}
//   </Stack>
// </Stack>
//   );
// };

// export default ContentTypeRender;
