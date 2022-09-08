// SPDX-License-Identifier: MIT

pragma solidity 0.8.8;

contract SimpleStorage {
    
    // this will get initialized to 0
    uint256 favoriteNumber;
    
    struct People {
        uint256 favoriteNumber;
        string name;
    }
    
    People[] public people; // array of type People

    mapping(string => uint256) public nameToFavoriteNumber; 
    // mapping is like a dictionary, here we are searching the favorite number of a person,
    // you give string (name), you receive number
    // public is for visibility and nameToFavoriteNumber: the name of mapping

    function store(uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }
    
    function retrieve() public view returns(uint256) {
        return favoriteNumber;
    }
    
    function addPerson(string memory _name, uint256 _favoriteNumber) public{
        people.push(People(_favoriteNumber, _name));    // we add the element to the array
        nameToFavoriteNumber[_name] = _favoriteNumber;  // we are mapping the name to the number
    }    
    
}
