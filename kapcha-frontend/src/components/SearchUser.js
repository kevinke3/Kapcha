// src/components/SearchUser.js

import React, { useState } from 'react';

const SearchUser = () => {
    const [username, setUsername] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/users/search?username=${username}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching for user:', error);
        }
    };

    return (
        <div>
            <h2>Search User</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {searchResults && (
                <div>
                    <h3>Search Results</h3>
                    {searchResults.length > 0 ? (
                        <ul>
                            {searchResults.map((user) => (
                                <li key={user.id}>{user.username}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No users found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchUser;
