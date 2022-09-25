//SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.9;
contract AstterLive{

    struct Profile{
        string name;
        string bitrate;
        string fps;
        string width;
        string height;
    }

    struct Stream {
        string streamName;
        string streamId;
        string description;
        uint category;
        string thumbnail;
    }

    mapping(address => bool) streamCreated;
    mapping(address => Stream) userStream;
    mapping(address => Profile[]) userProfiles;
    mapping(string => address) streamIdToUser;

    address owner;

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can access this function");
        _;
    }

    function hasStream(address user) public view returns(bool) {
        return streamCreated[user];
    }

    event StreamCreated(address indexed user, string indexed streamName);

    function createStream(string[] memory streamData, uint category, string[][] memory profiles) external{
        require(!hasStream(msg.sender), "User has an active stream. Please fetch streamId and create a session");
        userStream[msg.sender] = Stream(streamData[0], streamData[1], streamData[2], category, streamData[3]);
        streamIdToUser[streamData[1]] = msg.sender;

        Profile[] storage prof = userProfiles[msg.sender];
        for(uint i = 0; i<profiles.length; i++) {
            Profile memory p = Profile(profiles[i][0], profiles[i][1], profiles[i][2], profiles[i][3], profiles[i][4]);
            prof.push(p);
        }

        streamCreated[msg.sender] = true;

        emit StreamCreated(msg.sender, streamData[0]);
    }

    function getStreamer(string memory streamId) public  view returns(address) {
        return streamIdToUser[streamId];
    }

    function getStream(string memory streamId) public view returns(Stream memory) {
        return userStream[getStreamer(streamId)];
    }

    function getStreamforUser() external view returns(Stream memory) {
        require(hasStream(msg.sender), "User has not yet created a stream");
        return userStream[msg.sender];
    }

    function getProfilesforUser() external view returns (Profile[] memory) {
        require(hasStream(msg.sender), "User has not yet created a stream");
        return userProfiles[msg.sender];
    }

}