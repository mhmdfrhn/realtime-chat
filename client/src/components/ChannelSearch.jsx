import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';

import { SearchIcon } from '../assets';

const ChannelSearch = () => {
  const [querry, setQuerry] = useState('');
  const [loading, setLoading] = useState(false);

  const getChannels = async (text) => {
    try {
    } catch (error) {
      setQuerry('');
    }
  };

  const onSearch = (event) => {
    event.preventDefault();

    setLoading(true);
    setQuerry(event.target.value);
    getChannels(event.target.value);
  };

  return (
    <div className='channel-search__container'>
      <div className='channel-search__input__wrapper'>
        <div className='channel-search__input__icon'>
          <SearchIcon />
        </div>
        <input
          type='text'
          className='channel-search__input__text'
          placeholder='Search'
          value={querry}
          onChange={onSearch}
        />
      </div>
    </div>
  );
};

export default ChannelSearch;
