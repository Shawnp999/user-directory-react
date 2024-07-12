import * as React from 'react';
//import { useState,  useEffect } from 'react';
import styles from './SearchBar.module.scss';
import * as strings from 'UzmtoUserDirectoryWebPartStrings';

interface ISearchBarProps {
  searchText: string;
  onSearch: () => void;
  handleSearchInputChange: (searchText: string) => void;
}

const SearchBar: React.FC<ISearchBarProps> = ({ searchText, onSearch, handleSearchInputChange }) => {
 
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchInputChange(event.target.value);
  };

  const handleSearchButtonClick = () => {    
    if (searchText.trim() != '' && searchText.trim().length < 4) {
      alert(strings.Searchbar_CharError);
      return;
    }
    onSearch();    
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
 
    }
  };
 
  return (
    <div className={styles.searchInput}>
      <input
        type="text"
        placeholder={strings.SearchBar_PlaceHolder}
        value={searchText}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.searchbutton} onClick={handleSearchButtonClick}></button>
    </div>
  );
};

export default SearchBar;
