// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTEventTicketing is ERC721URIStorage, Ownable {
    uint256 private _eventIdCounter;
    uint256 private _ticketIdCounter;

    enum EventType { IN_PERSON, LIVE_SESSION, HACKATHON }

    struct Event {
        uint256 id;
        string name;
        EventType eventType;
        uint256 price;
        uint256 capacity;
        uint256 ticketsSold;
        address organizer;
    }

    struct Ticket {
        uint256 id;
        uint256 eventId;
        address owner;
        uint256 resalePrice;
        bool forSale;
    }
    struct Team {
        string name;
        address[] members;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => Team[]) public hackathonTeams;
    mapping(uint256 => uint256) public prizePools;
//Function to set the prize pool for a hackathon
function fundPrizePool(uint256 eventId) external payable {
    require(events[eventId].eventType == EventType.HACKATHON, "Only for hackathons");
    require(events[eventId].organizer == msg.sender, "Only organizer can fund");

    prizePools[eventId] += msg.value;
}
//Function to withdraw the prize pool for the hackathon
function withdrawPrizePool(uint256 eventId) external {
    require(events[eventId].eventType == EventType.HACKATHON, "Only for hackathons");
    require(events[eventId].organizer == msg.sender, "Only organizer can withdraw");

    uint256 amount = prizePools[eventId];
    prizePools[eventId] = 0;

    payable(msg.sender).transfer(amount);
}
//Function to award the prize to the winning team
function awardPrize(uint256 eventId, uint256 teamIndex) external {
    require(events[eventId].eventType == EventType.HACKATHON, "Only for hackathons");
    require(events[eventId].organizer == msg.sender, "Only organizer can award");
    require(teamIndex < hackathonTeams[eventId].length, "Invalid team index");

    Team storage winningTeam = hackathonTeams[eventId][teamIndex];
    uint256 prizeAmount = prizePools[eventId];

    prizePools[eventId] = 0;
    payable(winningTeam.members[0]).transfer(prizeAmount);
}
//Function to register a team for a hackathon
function registerTeam(uint256 eventId, string memory teamName, address[] memory members) external {
    require(events[eventId].eventType == EventType.HACKATHON, "Not a hackathon");
    require(events[eventId].organizer != address(0), "Event does not exist");
    require(members.length > 0, "Team must have members");

    hackathonTeams[eventId].push(Team({
        name: teamName,
        members: members
    }));
}
    event EventCreated(uint256 eventId, string name, EventType eventType, uint256 price, uint256 capacity, address organizer);
    event TicketPurchased(uint256 ticketId, uint256 eventId, address buyer);
    event TicketListedForResale(uint256 ticketId, uint256 resalePrice);
    event TicketResold(uint256 ticketId, address newOwner);

    constructor() ERC721("EventTicketNFT", "ETNFT") Ownable(msg.sender) {}

    // Create a new event
    function createEvent(
        string memory name,
        EventType eventType,
        uint256 price,
        uint256 capacity
    ) external {
        require(capacity > 0, "Capacity must be greater than 0");
        _eventIdCounter++;
        uint256 eventId = _eventIdCounter;

        events[eventId] = Event({
            id: eventId,
            name: name,
            eventType: eventType,
            price: price,
            capacity: capacity,
            ticketsSold: 0,
            organizer: msg.sender
        });

        emit EventCreated(eventId, name, eventType, price, capacity, msg.sender);
    }

    // Buy a ticket for an event
    function buyTicket(uint256 eventId) external payable {
        Event storage eventDetails = events[eventId];
        require(eventDetails.id != 0, "Event does not exist");
        require(eventDetails.ticketsSold < eventDetails.capacity, "Event is sold out");
        require(msg.value == eventDetails.price, "Incorrect payment amount");

        _ticketIdCounter++;
        uint256 ticketId = _ticketIdCounter;

        tickets[ticketId] = Ticket({
            id: ticketId,
            eventId: eventId,
            owner: msg.sender,
            resalePrice: 0,
            forSale: false
        });

        eventDetails.ticketsSold++;

        _mint(msg.sender, ticketId);
        
        // Generate metadata URI with event info
        string memory tokenURI = generateTokenURI(ticketId, eventId, eventDetails.name);
        _setTokenURI(ticketId, tokenURI);

        // Send payment to event organizer
        payable(eventDetails.organizer).transfer(msg.value);

        emit TicketPurchased(ticketId, eventId, msg.sender);
    }

    // List a ticket for resale
    function listTicketForResale(uint256 ticketId, uint256 resalePrice) external {
        require(ownerOf(ticketId) == msg.sender, "You are not the owner of this ticket");
        require(resalePrice > 0, "Resale price must be greater than 0");

        Ticket storage ticket = tickets[ticketId];
        ticket.resalePrice = resalePrice;
        ticket.forSale = true;

        emit TicketListedForResale(ticketId, resalePrice);
    }

    // Buy a ticket from resale
    function buyResaleTicket(uint256 ticketId) external payable {
        require(_exists(ticketId), "Ticket does not exist");
        
        Ticket storage ticket = tickets[ticketId];
        require(ticket.forSale, "Ticket is not for sale");
        require(msg.value == ticket.resalePrice, "Incorrect payment amount");

        address previousOwner = ticket.owner;
        
        // Update ticket information
        ticket.owner = msg.sender;
        ticket.forSale = false;
        ticket.resalePrice = 0;

        // Transfer NFT ownership
        _transfer(previousOwner, msg.sender, ticketId);
        
        // Send payment to previous owner
        payable(previousOwner).transfer(msg.value);

        emit TicketResold(ticketId, msg.sender);
    }

    // Cancel resale listing
    function cancelResaleListing(uint256 ticketId) external {
        require(ownerOf(ticketId) == msg.sender, "You are not the owner of this ticket");
        
        Ticket storage ticket = tickets[ticketId];
        require(ticket.forSale, "Ticket is not listed for resale");
        
        ticket.forSale = false;
        ticket.resalePrice = 0;
    }

    // Check if a ticket exists
    function _exists(uint256 ticketId) internal view returns (bool) {
        return tickets[ticketId].id != 0;
    }

    // Override required functions for NFT transfers
    function _update(address to, uint256 ticketId, address auth) internal override returns (address) {
        address from = super._update(to, ticketId, auth);
        
        // Update ticket ownership when NFT is transferred
        if (from != address(0) && to != address(0) && tickets[ticketId].id != 0) {
            tickets[ticketId].owner = to;
            tickets[ticketId].forSale = false;
            tickets[ticketId].resalePrice = 0;
        }
        
        return from;
    }

    // Generate token URI with event information
    function generateTokenURI(uint256 ticketId, uint256 eventId, string memory eventName) internal pure returns (string memory) {
        string memory baseURI = "https://api.example.com/tickets/";
        string memory ticketIdStr = uint2str(ticketId);
        string memory eventIdStr = uint2str(eventId);
        
        return string(abi.encodePacked(
            baseURI, 
            ticketIdStr, 
            "?event=", 
            eventIdStr, 
            "&name=", 
            eventName
        ));
    }

    // Helper function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}