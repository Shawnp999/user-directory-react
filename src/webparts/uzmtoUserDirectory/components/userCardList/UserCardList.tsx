import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './UserCardList.module.scss';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import UserCard from '../usercard/UserCard';
import { IAddtionalUserSettings } from '../entities/AdditionalUserSettings';
import { IDepartment } from '../departments/entity/Departmen';

interface IUserCardListProps {
  users: MicrosoftGraph.User[];
  highlightEmail: (emailFromAD: string | undefined, userId?: string) => string;
  myDepartment: IDepartment | null | undefined;
}

const UserCardList: React.FC<IUserCardListProps> = ({ users, highlightEmail, myDepartment }) => {
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getAdditionalUserSettings = (extensions: MicrosoftGraph.Extension[] | undefined | null): IAddtionalUserSettings | undefined => {
    if (extensions == undefined) {
      return undefined;
    }

    const additionalUserSettingsExt = extensions.filter((extension) => {
      return extension.id == "com.uzmto.additionalUserSettings";
    });

    if (additionalUserSettingsExt.length === 0) {
      return undefined;
    }

    return additionalUserSettingsExt[0] as IAddtionalUserSettings;
  }

  if (isMobileView) {
    return (
        <div className={styles.userCardListMobile}>
          {users.map((user, index) => (
              <div className={styles.userCardMobile} key={index}>
                <UserCard
                    user={user}
                    manager={user.manager!}
                    additionalUserSettings={getAdditionalUserSettings(user.extensions)}
                    highlightEmail={highlightEmail}
                    myDepartment={myDepartment}
                />
              </div>
          ))}
        </div>
    );
  }

  let remainingUsers = users;
  const firstUser = users.length > 0 ? users[0] : null;
  let isFirstUserDepartmentManager = false;

  if (firstUser) {
    users.map((user) => {
      if (user.manager && user.manager?.id === firstUser.id) {
        isFirstUserDepartmentManager = true;
        return;
      }
    });
  }

  if (isFirstUserDepartmentManager) {
    remainingUsers = users.slice(1);
  }

  const userPairs: MicrosoftGraph.User[][] = [];
  for (let i = 0; i < remainingUsers.length; i += 2) {
    userPairs.push(remainingUsers.slice(i, i + 2));
  }

  return (
      <div className={styles.userCardList}>
        {firstUser && isFirstUserDepartmentManager && (
            <div className={styles.userPair} key={0}>
              <div className={styles.cell}>
                <UserCard
                    user={firstUser}
                    manager={firstUser.manager!}
                    additionalUserSettings={getAdditionalUserSettings(firstUser.extensions)}
                    highlightEmail={highlightEmail}
                    myDepartment={myDepartment}
                />
              </div>
            </div>
        )}

        {userPairs.map((userPair, pairIndex) => (
            <div className={styles.userPair} key={pairIndex}>
              {userPair.map((user, userIndex) => (
                  <div className={styles.cell} key={userIndex}>
                    <UserCard
                        user={user}
                        manager={user.manager!}
                        additionalUserSettings={getAdditionalUserSettings(user.extensions)}
                        highlightEmail={highlightEmail}
                        myDepartment={myDepartment}
                    />
                  </div>
              ))}
            </div>
        ))}
      </div>
  );
}

export default UserCardList;
