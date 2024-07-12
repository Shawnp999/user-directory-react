import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Department } from "./departments/entity/Departmen";
// import { MSGraphClientV3 } from "@microsoft/sp-http";

export interface IUzmtoUserDirectoryProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  currentUserDepartment?: Department;
  
}
