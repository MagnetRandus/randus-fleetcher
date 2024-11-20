import IType_Columns from "@Async/ContentTypes/Column.types";
import IType_ContentType from "@Async/ContentTypes/ContentType.types";
import ContentTypesGet from "@Async/ContentTypes/Get";

import GetColumns from "@Async/ContentTypes/GetColumns";
import ListsGet from "@Async/Lists/Get";
import IType_List from "@Async/Lists/Lists.types";
import { Dropdown, IDropdownOption, Stack } from "@fluentui/react";
import * as React from "react";
// import GetLookupInfo from "src/libraries/Toolbox/Tools.GetLookupInfo";
import GetLookupInfo from "src/libraries/Toolbox/Tools.GetLookupInfo";
import type { ISpFleetProps } from "./ISpFleetAProps";

export interface ISPFleetState {
  ContentTypes: Array<IType_ContentType>;
  Lists: Array<IType_List>;
  Columns: Array<IType_Columns>;
  ListSelectedId: string | undefined;
  ContentTypeSelectedName: string | undefined;
  LookupToInfo: Array<ILookupInfo>;
}

const celStyle: React.CSSProperties = {
  verticalAlign: "top",
  textAlign: "left",
  maxHeight: "15px",
};

interface IOption {
  key: string;
  text: string;
}

interface ILookupInfo {
  ColumnInternalName: string;
  LookupToListName: string;
  LookupToColumnName: string;
}

export default class SpFleetA extends React.Component<
  ISpFleetProps,
  ISPFleetState
> {
  constructor(props: ISpFleetProps) {
    super(props);
    this.state = {
      ContentTypes: [],
      Columns: [],
      Lists: [],
      ListSelectedId: undefined,
      ContentTypeSelectedName: undefined,
      LookupToInfo: [],
    };
    this.setColumnValues = this.setColumnValues.bind(this); //If you forget to bind here, this.setState won't work
  }
  setColumnValues(values: IType_Columns[]): void {
    this.setState((prevState) => {
      return {
        ...prevState,
        Columns: values,
      };
    });
  }
  getCSVLine(
    colTitle: string,
    colDescription: string,
    colType: string,
    lookupListName: string,
    lookedupColName: string
  ): string {
    return `"${colTitle.split(",").join("[#COMMA#]")}","${colDescription
      .split(",")
      .join("[#COMMA#]")}","${colType
      .split(",")
      .join("[#COMMA#]")}","${lookupListName
      .split(",")
      .join("[#COMMA#]")}","${lookedupColName.split(",").join("[#COMMA#]")}"`;
  }
  downloadCSVFile = (
    ev?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const getExtraInfo = async (column: IType_Columns): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        try {
          if (column.FieldTypeKind === 7) {
            GetLookupInfo(this.props.context, column)
              .then((colInfoResolved) => {
                const lstName = this.state.Lists.filter(
                  (j) =>
                    j.Id ===
                    colInfoResolved.LookupList.replace("{", "").replace("}", "")
                )[0].Title;
                const k = this.getCSVLine(
                  column.Title,
                  column.Description,
                  column.TypeAsString,
                  lstName,
                  colInfoResolved.LookupField
                );
                resolve(k);
              })
              .catch((colInferr) => {
                console.log("Error to resolve column info");
              });
          } else {
            const k = this.getCSVLine(
              column.Title,
              column.Description,
              column.TypeAsString,
              "",
              ""
            );
            resolve(k);
          }
        } catch (error) {
          reject(error);
        }
      });
    };

    if (this.state && this.state.ListSelectedId) {
      const allColsInfo = new Array<Promise<string>>();
      const fCols = this.state.Columns.filter((j) => !j.Hidden);
      fCols.forEach((column) => {
        allColsInfo.push(getExtraInfo(column));
      });

      Promise.all(allColsInfo)
        .then((allCols) => {
          console.log("All Cols OK");
          const csvText = [
            `${[
              `"Title"`,
              `"Description"`,
              `"ColumnType"`,
              `"LookupListName"`,
              `"LookedUpColName"`,
            ].join(`,`)}\n`,
            allCols.join(`\n`),
          ].join("");

          const blob = new Blob([csvText], {
            type: "text/csv;charset=utf-8;",
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          const listName = this.state.Lists.filter(
            (j) => j.Id === this.state.ListSelectedId
          )[0].Title;
          link.download = `${listName}-${this.state.ContentTypeSelectedName}.csv`; // Use ListSelected for the filename
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        })
        .catch((allColsfail) => {
          console.log("All Cols failed");
          console.dir(allColsfail);
        });
    }
  };
  handleLookupGetter(
    j: IType_Columns,
    whichCol: "LookupToListName" | "LookupToColumnName"
  ): string {
    if (
      this.state.LookupToInfo &&
      this.state.LookupToInfo.length !== 0 &&
      this.state.LookupToInfo.filter(
        (J) => J.ColumnInternalName === j.InternalName
      ).length !== 0
    ) {
      if (whichCol === "LookupToColumnName") {
        return this.state.LookupToInfo.filter(
          (J) => J.ColumnInternalName === j.InternalName
        )[0].LookupToColumnName;
      }
      if (whichCol === "LookupToListName") {
        return this.state.LookupToInfo.filter(
          (J) => J.ColumnInternalName === j.InternalName
        )[0].LookupToListName;
      }
    }
    return "";
  }
  public render(): React.ReactElement<ISpFleetProps> {
    const handleContentTypeSelect = (
      event: React.FormEvent<HTMLDivElement>,
      option: IDropdownOption<IOption> | undefined
    ): void => {
      if (option && this.state.ListSelectedId) {
        GetColumns(
          this.props.context,
          this.state.ListSelectedId,
          String(option.key)
        )
          .then((response) => {
            this.setColumnValues(response);
            this.downloadCSVFile();
          })
          .catch((err) => console.error(err));
      }
    };

    const options: IDropdownOption[] = this.state.ContentTypes.map((j) => {
      return {
        key: String(j.Id.StringValue),
        text: String(j.Name),
      };
    });

    return (
      <Stack>
        <Stack>
          <Dropdown
            placeholder="Select an option"
            label="Select a list"
            options={this.state.Lists.filter((j) => !j.Hidden).map((j) => {
              return {
                key: j.Id,
                text: j.Title,
              };
            })}
            onChange={(event, option) => {
              this.setState((prevState) => {
                return {
                  ...prevState,
                  ListSelectedId: option?.key.toString(),
                  Columns: [],
                };
              });
            }}
          />
        </Stack>
        <Stack>
          {this.state && this.state.ContentTypes.length !== 0 ? (
            <>
              <div>Found {this.state.ContentTypes.length} Content Types</div>
              <Stack tokens={{ childrenGap: 5 }}>
                <Stack>
                  {this.state.ContentTypes.length !== 0 && (
                    <Dropdown
                      placeholder="Select an option"
                      label="Select a Content Type"
                      options={options}
                      onChange={(event, option) => {
                        this.setState((prevState) => {
                          return {
                            ...prevState,
                            ContentTypeSelectedName: option?.text,
                          };
                        });
                        handleContentTypeSelect(event, option);
                      }}
                    />
                  )}
                </Stack>
              </Stack>
            </>
          ) : (
            <div>...</div>
          )}
        </Stack>
        {/**
         * COLUMNS INFO RENDERED (AS COLUMNS :D )
         */}
        <Stack>
          <Stack>
            {this.state.Columns.length > 0 && (
              <>
                <button
                  onClick={(ev) => {
                    this.downloadCSVFile(ev);
                  }}
                >
                  Download CSV
                </button>
              </>
            )}
          </Stack>
        </Stack>
        <Stack>
          {this.state.Columns.length > 0 && (
            <table>
              <tr>
                <th style={celStyle}>internal name</th>
                <th style={celStyle}>display name</th>
                <th style={celStyle}>description</th>
                <th style={celStyle}>coltype</th>
                <th style={celStyle}>lkptoList</th>
                <th style={celStyle}>lkptoField</th>
              </tr>
              {this.state.Columns.filter((j) => !j.Hidden).map((j, i) => (
                <tr key={i}>
                  <td
                    style={{
                      ...celStyle,
                      maxWidth: 120,
                      wordWrap: "break-word",
                    }}
                  >
                    {j.InternalName}
                  </td>
                  <td style={celStyle}>{j.Title}</td>
                  <td style={celStyle}>{j.Description}</td>
                  <td style={celStyle}>
                    <div>{j.TypeAsString}</div>
                  </td>
                  <td>{this.handleLookupGetter(j, "LookupToListName")}</td>
                  <td>{this.handleLookupGetter(j, "LookupToColumnName")}</td>
                </tr>
              ))}
            </table>
          )}
        </Stack>
      </Stack>
    );
  }
  componentDidUpdate(
    prevProps: Readonly<ISpFleetProps>,
    prevState: Readonly<ISPFleetState>
  ): void {
    if (this.state.ListSelectedId !== prevState.ListSelectedId) {
      if (this.state.ListSelectedId) {
        ContentTypesGet(this.props.context, this.state.ListSelectedId)
          .then((ctNames) => {
            this.setState((pState) => {
              return {
                ...pState,
                ContentTypes: ctNames,
              };
            });
          })
          .catch((err) => console.error(err));
      }
    }
    if (this.state.Columns.length !== prevState.Columns.length) {
      this.setState((prevState) => {
        return {
          ...prevState,
          LookupToColsFound: this.state.Columns.filter(
            (j) => j.FieldTypeKind === 7
          ).length,
        };
      });
      // const fn = async (): Promise<void> => {
      //   for await (const element of this.state.Columns.filter(
      //     (j) => j.FieldTypeKind === 7
      //   )) {
      //     // const lookupInfo = await GetLookupInfo(this.props.context, element);
      //     // const inf = {
      //     //   ColumnInternalName: element.InternalName,
      //     //   LookupToColumnName: lookupInfo.LookupField,
      //     //   LookupToListName: lookupInfo.ListName,
      //     // };
      //     console.log(`Col added`);
      //     console.dir(inf);
      //     this.setState((prevState) => {
      //       return {
      //         ...prevState,
      //         LookupToInfo: [...prevState.LookupToInfo, inf],
      //       };
      //     });
      //   }
      // };
      // fn().catch((err) => console.error(err));
    }
    if (this.state.LookupToInfo.length !== prevState.LookupToInfo.length) {
      console.log(`Found lookup column: ${this.state.LookupToInfo.length}`);
    }
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.dir(error);
    console.dir(errorInfo);
  }
  componentDidMount(): void {
    ListsGet(this.props.context)
      .then((resLists) => {
        this.setState((pState) => {
          return {
            ...pState,
            Lists: resLists,
          };
        });
      })
      .catch((err) => console.error(err));
  }
}
