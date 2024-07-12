declare interface IUzmtoUserDirectoryWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;

  Searchbar_CharError : string,
  SearchBar_PlaceHolder : string,
  ManagerTitle : string ,
  NoManagerTitle : string,
  UserInfo_InnerPhone : string,

  NoUsersFound : string;


}

declare module 'UzmtoUserDirectoryWebPartStrings' {
  const strings: IUzmtoUserDirectoryWebPartStrings;
  export = strings;
}
