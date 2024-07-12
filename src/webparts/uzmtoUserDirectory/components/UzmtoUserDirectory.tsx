import TopologicalSort from 'topological-sort';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import DepartmentFilter from './departments/DepartmentFilter';
import { OrgStructure } from './departments/entity/OrgStructure';
import { Department } from './departments/entity/Departmen';
import UserCardList from './userCardList/UserCardList';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import SearchBar from './SearchBar/SearchBar';
import styles from './UzmtoUserDirectory.module.scss';
//import { UzmtoUser } from './entities/UzmtoUser';
import * as strings from 'UzmtoUserDirectoryWebPartStrings';


interface IUzmtoUserDirectoryProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  currentUserDepartment?: Department;
}

interface ISearchUserObj {
  id: string;
}

interface UserWithLanguages extends MicrosoftGraph.User {
  languages?: string[];
  media?: {
    instagram?: string;
    meta?: string;
    telegram?: string;
    twitter?: string;
    linkedin?: string;
  };
}


const UzmtoUserDirectory: React.FunctionComponent<IUzmtoUserDirectoryProps> = (props: IUzmtoUserDirectoryProps) => {
  const [users, setUsers] = useState<UserWithLanguages[]>([]);
  // const [user, setUser] = useState<UserWithLanguages>({
  //   media: {
  //     instagram   : "",
  //     meta        : "",
  //     telegram    : "",
  //     twitter     : "",
  //     linkedin    : "",
  //   },
  // });
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [myDepartment, setMyDepartment] = useState<Department | null>(null);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  
  

  const orgStructure = new OrgStructure();
  orgStructure.init();

  const orgStructureMap: Map<string, string> = new Map();

  orgStructure.departments.forEach(dep => {
    orgStructureMap.set(dep.departmentAAD, dep.departmentName);
  });

  useEffect(() => {

    props.context.msGraphClientFactory.getClient('3').then((client: MSGraphClientV3): void => {

      client.api("/me").version("beta").select("department").get((error, result: MicrosoftGraph.User, rawResponse?: any) => {
        if (error) {
          console.log("error fetching current user's dep:", error);
        } else {
          const currentUserDepartment: string = result?.department || '';
          const userDepartment: Department | undefined = orgStructure.departments.find((department) => {
            return department.departmentAAD === currentUserDepartment;
          });
          setSelectedDepartment(userDepartment || null);
          setMyDepartment(userDepartment  || null);
        }
      });

    });

  }, []);

  const correctUserDepartmentName = (incorrectDepartmentName: string | undefined) => {
    if (incorrectDepartmentName === undefined || incorrectDepartmentName === null) {
      return 'No department';
    }

    const correctName = orgStructureMap.get(incorrectDepartmentName);

    if (correctName === undefined) {
      return 'No department';
    }

    return correctName;
  };

  const sortUsers = (users: MicrosoftGraph.User[], selectedDepartmentId: string): MicrosoftGraph.User[] => {

    const correctDepartmentName: string = correctUserDepartmentName(selectedDepartmentId);


    const filteredUsers = users.filter(user =>
      !user.department || user.department.toLowerCase() === correctDepartmentName.toLowerCase()
    );

  
    const nodes = new Map<string, MicrosoftGraph.User>();
  
    // adds all users and managers to map
    filteredUsers.forEach(user => {
      nodes.set(user.id!, user);
  
      const managerId = user.manager?.id;
      const manager = user.manager as MicrosoftGraph.User;
  
      // check if manager is defined
      if (manager) {
        const managerdep = manager.department?.toLowerCase(); 
  
        if (
          managerId &&
          (!managerdep || managerdep === selectedDepartmentId.toLowerCase()) &&
          !nodes.has(managerId)
        ) {
          nodes.set(managerId, user.manager!);
        }
  
      }
    });
  
    const sortOp = new TopologicalSort<string, MicrosoftGraph.User>(nodes);
  
    // build "edges" prioritizing the direct manager
    filteredUsers.forEach(user => {

      const managerId = user.manager?.id;
      const userId = user.id!;
      const manager = user.manager as MicrosoftGraph.User;
  
      // check if manager is defined
      if (manager) {
        const managerdep = manager.department?.toLowerCase();
  
        if (
          managerId &&
          (!managerdep || managerdep === selectedDepartmentId.toLowerCase()) &&
          nodes.has(managerId)
        ) {
          sortOp.addEdge(managerId, userId);
        } else {
        }
      }
    });
  
    // handles the case when a user's manager is not in the array (dataset)
    const sortedUserNodes = Array.from(sortOp.sort().values());
    const sortedUsers = sortedUserNodes.map(node => node.node);
  
    // console.log("Sorted Users topograph:", sortedUsers);

    return sortedUsers;
  };


  const postProcessUsers = (users: MicrosoftGraph.User[]): MicrosoftGraph.User[] => {
    const filteredUsers = users.filter(user => {
      return user.mail!.endsWith('@uzmto.com') || user.mail == 'aleksey.semenov@ent-en.com';
    });
  
    filteredUsers.forEach((user) => {            
      user.department = correctUserDepartmentName(user.department || undefined);
      
      //     // testing
      //     if (user.id === '1072f80e-0652-4f1e-809e-dbb860af0880') {
      //       user.mail = HighlightUZMTOEmail('diana.khalikova@ent-en.com');
      //     } else {
  
      //check if null
      user.mail = user.mail ? HighlightUZMTOEmail(user.mail) : undefined;
      // }
    });
  
    return filteredUsers;
  }
  
 
  const fetchUsers = (filterString: string | null, searchString: string | null) => {
    props.context.msGraphClientFactory.getClient('3').then((client: MSGraphClientV3): void => {
      setIsLoading(true);

      if (!filterString && !searchString) {
          setIsLoading(false);
          return;
      }


      let modifiedFilterString: string | null = filterString;

      // by department
      if (filterString) {
          client.api(`/users`)
          .header('ConsistencyLevel', 'eventual')
          .expand('manager($select=id,displayName,department),extensions')
          .count(true)
          .select('id,displayName,department,mail,businessPhones,mobilePhone,jobTitle,extensions')
          .filter(filterString)
          .get((error, result: any) => {
              if (error) {
                  console.log("Error fetching users:", error);
                  setIsLoading(false);
                  return;
              }

              const processedUsers = postProcessUsers(result.value);
              const sortedUsers = sortUsers(processedUsers, selectedDepartment?.departmentAAD || '');

              //Test, set ent-en.com email for user Pantzlaff Shawn

              const sortedUsersWithHighlightedEmail = sortedUsers.map((user) => {
                return {
                  ...user,
                  mail: HighlightUZMTOEmail(user.mail ?? ""),
                };
              });
              
              setUsers(sortedUsersWithHighlightedEmail);
              



              setUsers(sortedUsers);
              setIsLoading(false);
          });
      }

      // by name
      if (searchString) {
          client.api(`/users`)
          .header('ConsistencyLevel', 'eventual')
          .search(`"displayName:${searchString}" OR "mail:${searchString}" OR "businessPhones:${searchString}"`)
          .select('id')
          .get((error, result: any) => {
            if (error) {
                console.log("Error fetching users:", error);
                setIsLoading(false);
                return;
            }

            const searchUserObj: ISearchUserObj[] = result.value;

            if (searchUserObj.length === 0) {
                setUsers([]);
                alert("No users found");
                setIsLoading(false);
                return;
            }

            const searchUserIds = searchUserObj.map(searchObj => `'${searchObj.id}'`).join(', ');
            modifiedFilterString = `id in (${searchUserIds})`;
            

            // by search string
            client.api(`/users`)
                .header('ConsistencyLevel', 'eventual')
                .expand('manager($select=id,displayName,department),extensions')
                .count(true)
                .select('id,displayName,department,mail,businessPhones,mobilePhone,jobTitle,extensions')
                .filter(modifiedFilterString)
                .get((error, result: any) => {
                  if (error) {
                      console.log("Error fetching users:", error);
                      setIsLoading(false);
                      return;
                  }

                  const processedUsers = postProcessUsers(result.value);
                  setUsers(processedUsers);
                  setIsLoading(false);
                });
      });
      }
  });
};

  const HighlightUZMTOEmail = (emailFromAD: string | undefined | null, userId: string = ''): string => {
    if (!emailFromAD) {
      return 'No Email';  
    }

    if (emailFromAD.endsWith('uzmto.com')) {
      return emailFromAD;
    }

    return `${emailFromAD}`;
  };

  

  const fetchUsersByDepartment = () => {
    let filterString: string | null = null;

    if (selectedDepartment) { 
      filterString = `department eq '${selectedDepartment.departmentAAD}'`;
    }

    fetchUsers(filterString, '');
    setSearchText('');
  }

  const fetchUsersByName = (searchText: string) => {
    let filterString: string = '';
    fetchUsers(filterString, searchText.trim());
    setSelectedDepartment(null);
  };

  const searchUsersByName = () => {
    if (searchText == null) {
      return;
    }

    if (searchText.trim() === '') {
      setSelectedDepartment(myDepartment);
      fetchUsersByDepartment();
      return;
    } 

    fetchUsersByName(searchText);
  };

  const handleSearchInputChange = (searchText: string) => {
    setSearchText(searchText)
  }

  useEffect(() => {
    fetchUsersByDepartment();
  }, []);

  useEffect(() => {
    if (selectedDepartment !== null && selectedDepartment !== undefined) {
      fetchUsersByDepartment();
    }
  }, [selectedDepartment]);

  
  return (

      <section>
        <SearchBar searchText={searchText != null ? searchText : ''} onSearch={searchUsersByName}
                   handleSearchInputChange={handleSearchInputChange}/>

        {isLoading && (
            <div className={styles.loadingContainer}>
              <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="Loading..."/>
            </div>
        )}

        {!isLoading && (
            <>
              <DepartmentFilter
                  orgStructure={orgStructure}
                  selectedDepartment={selectedDepartment}
                  changeDepartmentMethod={setSelectedDepartment}
              />

              {users.length === 0 ? (
                  <div className={styles.NoUsersFound}>{strings.NoUsersFound}</div>
              ) : (
                  <UserCardList users={users} highlightEmail={HighlightUZMTOEmail} myDepartment={myDepartment}/>
              )}
            </>
        )}
      </section>


  );
};

export default UzmtoUserDirectory;
