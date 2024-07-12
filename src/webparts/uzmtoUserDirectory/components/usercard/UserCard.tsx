import * as React from 'react';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import styles from './usercardcss.module.scss';
import { IAddtionalUserSettings } from '../entities/AdditionalUserSettings';
import * as strings from 'UzmtoUserDirectoryWebPartStrings';
import { IDepartment } from '../departments/entity/Departmen';
//import { Department } from '../departments/entity/Departmen';

interface IUserCardProps {
  user: MicrosoftGraph.User;
  manager: MicrosoftGraph.User;
  additionalUserSettings: IAddtionalUserSettings | undefined;
  highlightEmail: (emailFromAD: string | undefined, userId?: string) => string;
  myDepartment : IDepartment | null | undefined
  // loggedInUser?: MicrosoftGraph.User;
  
}

const UserCard: React.FC<IUserCardProps>  = ({ user, manager, additionalUserSettings, myDepartment}) => {

  const transformText = (text: string, minLength: number, maxParts: number): React.ReactNode => {

    if (!text || text.length <= minLength) {
      return text || '';
    }

    const textParts = text.split(' ');

    if (textParts.length <= maxParts) {
      return text;
    }

    return (
      <>
        {textParts.slice(0, maxParts).join(' ')}
        <br />
        {textParts.slice(maxParts).join(' ')}
      </>

    );
  };

  const getManagerNameLetters = (displayName: string): string => {

    if (!displayName) {
      return '';
    }

    const nameParts: string[] = displayName.split(' ');

    if (nameParts.length < 2) {
      return '';
    }

    const lastName = nameParts[0].charAt(0);
    const firstName = nameParts[1].charAt(0);

    return lastName + firstName;
  };

  const formatMobilePhone = (mobilePhone: string | undefined): string => {

    if (!mobilePhone) {
      return '';
    }

    //check if phonenumber has +
    if (mobilePhone.startsWith('+')) {
      return formatPhoneNumber(mobilePhone);
    } else {
      return formatPhoneNumber('+' + mobilePhone);
    }
  };

  const formatPhoneNumber = (phoneNumber: string): string => {

    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

    //format phone number to +xxx xx xxx xx xx format
    return cleanedPhoneNumber.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
  };
  //console.log("media insta",media.instagram)

  const transformedDisplayName = transformText(user.displayName!, 40, 2);
  const transformedDepartmentName = transformText(user.department || '', 50, 2);
  const userManager: MicrosoftGraph.User = user.manager as MicrosoftGraph.User;
  const managerLetter = getManagerNameLetters(userManager ? userManager.displayName! : 'N A');

  const username = user.mail?.replace('@uzmto.com', '');
  const userPhotoUrl = 'https://eneraseg.sharepoint.com/sites/UZMTO2/foto_employees/' + username + '/big_pic.jpg';

  const isSpecialUser = user.id === '6248d93e-b3dd-4fdf-9d94-2c7a12f0a6dc';

  const isManagerUndefined = userManager === null || userManager === undefined;

  //socials links
  const instLink = additionalUserSettings?.media.instagram;
  const instaURL = instLink ? `https://www.instagram.com/${instLink}` : '';

  const teleUserName = additionalUserSettings?.media.telegram;
  const teleUrl = teleUserName ? `https://t.me/${teleUserName}` : '';

  const LinkedInUserName = additionalUserSettings?.media.linkedin;
  const LinkedInURL = LinkedInUserName ? `https://www.linkedin.com/in/${LinkedInUserName}` : '';

  const TwitterUserName = additionalUserSettings?.media.twitter;
  const TwitterURL = TwitterUserName ? `https://twitter.com/${TwitterUserName}` : '';

  const MetaUserName = additionalUserSettings?.media.meta;
  const MetaURL = MetaUserName ? `https://facebook.com/${MetaUserName}` : '';

  const NoUserPhotoUrl = `https://eneraseg.sharepoint.com/sites/UZMTO2/foto_employees/NoPhoto/nophoto.jpg`;

  const highlightEmail = (emailFromAD: string | undefined): JSX.Element => {

    const isUzmtoEmail = emailFromAD?.toLowerCase().endsWith('@uzmto.com');
    const isITDepartmentUser = myDepartment?.departmentName === 'Департамент информационных технологий';
  
    return (
      <span style={{ color: isUzmtoEmail || !isITDepartmentUser ? 'inherit' : 'red' }}>
        {emailFromAD}
      </span>
    );
  };

  return (
    <div className={styles.cell}>
      <div className={styles.userContainer}>
        <div className={styles.photoContainer}>

          <img
            src={userPhotoUrl || NoUserPhotoUrl}
            alt="User Photo"
            onClick={() => (window.location.href = `https://eneraseg.sharepoint.com/sites/UZMTO2/SitePages/profile-page.aspx?userId=${user.id}`)}
            onError={(e) => {
              e.currentTarget.src = NoUserPhotoUrl;
              e.currentTarget.style.borderRadius = '10px';
              e.currentTarget.style.objectFit = 'cover';
              e.currentTarget.style.width = '100%';
            }}
            style={{ width: '100%', cursor: 'pointer', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
          />

        </div>
        <div className={styles.userInfoContainer}>
          <div
            className={styles.displayName + ' ' + styles.userInfoCnt}
            // onClick={() => (window.location.href = `https://eneraseg.sharepoint.com/sites/UZMTO2/SitePages/profile-page.aspx?userId=${user.id}`)}
            //style={{ cursor: 'pointer' }}
          >
            {transformedDisplayName}
            <br />
            <div className={styles.jobTitle} style={{ color: '#b1b2c4', fontFamily: 'medium' }}>
              {user.jobTitle} 
            </div>
          </div>
          <div className={`${styles.department} ${styles.userInfoCnt}`}>
            <div>{transformedDepartmentName}</div>
            {!isSpecialUser && (
              <div
                className={styles.managerLetters}
                onClick={() => (window.location.href = `https://eneraseg.sharepoint.com/sites/UZMTO2/SitePages/profile-page.aspx?userId=${manager.id}`)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: isManagerUndefined ? 'red' : '#acbdce',
                }}
              >
                <div className={styles.tooltip} data-tooltip={isManagerUndefined ? strings.NoManagerTitle : strings.ManagerTitle + " " + manager.displayName as string}>
                  {managerLetter}
                </div>
              </div>
            )}
          </div>
          <div className={styles.department + ' ' + styles.userInfoCnt}>
            {highlightEmail(user.mail?.toString())}
          </div>
          <div className={`${styles.department} ${styles.userInfoCnt}`} style={{ justifyContent: 'unset' }}>
            <span className={styles.spanclass}>{strings.UserInfo_InnerPhone}: &nbsp;</span> {user.businessPhones?.join(',')}
          </div>
          <div className={`${styles.department} ${styles.userInfoCnt}`}>{formatMobilePhone(user.mobilePhone!)}</div>
          <div className={styles.socialIconContainer}>
            <div className={styles.socialIconsLeft}></div>
            <div className={styles.socialIconsRight}>
              {additionalUserSettings && additionalUserSettings.media.meta && <a href={MetaURL} target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.meta}`} />}
              {additionalUserSettings && additionalUserSettings.media.instagram && (
                <div className={styles.instasocials}>
                  <a href={instaURL} target="_blank" rel="noopener noreferrer" className={styles.insta} />
                </div>
              )}
              {additionalUserSettings && additionalUserSettings.media.linkedin && (
                <a href={LinkedInURL} target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.LinkedIn}`} />
              )}
              {additionalUserSettings && additionalUserSettings.media.telegram && (
                <a href={teleUrl} target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.telegram}`} />
              )}
              {additionalUserSettings && additionalUserSettings.media.twitter && (
                <a href={TwitterURL} target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.twitter}`} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




export default UserCard;
