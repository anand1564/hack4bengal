
#  Hack4Bengal Virtual Hackathon Project – **EventChain**

**EventChain** is a decentralized event management platform designed to make organizing and participating in events (like hackathons, workshops, and meetups) seamless, secure, and collaborative — all powered by blockchain.

## Demo
Check out the demo video here: [Watch on YouTube](https://www.youtube.com/watch?v=2a-8n70l-2k)

## How to Run the Project Locally

1. Clone the Repository
2. npm install
3. npm run dev
4. Start the Backend Server
cd backend
npm install
npx nodemon index.js

5. Deploy the Smart Contract Locally
In the root folder:
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
* Don't forget to update your hardhat.config.js file to support the localhost network.


## Problem statement that we are solving 

EventChain is a decentralised event management platform meant for users to efficiently create and organise live sessions, workshops , offline meetups and hackathons too.

0. Secure & Fast Ticketing with blockchain-backed payments

1. Tamper-Proof Tickets with auto-generated QR-coded PDFs after successful transactions

2. Real-Time Event Chats to collaborate and share ideas

3. Hackathon Hosting Support for seamless organizer and participant experience

4. Persistent Dashboard to manage and view your ticket history without fear of losing them

## Problems that we faced

1. None of us really had much prior experience building web3 projects so this was really a challenge for us and we had to learn a lot to keep up and deliver the project in time .

2. Finalising the schema for the db was much more complicated than expected , we had to make changes to it every now and then to accomodate new features in it.

3. Working with so many lines of code in the frontend and backend was a confusing and challenging task, we could have managed the components better and avoid the mess, but i guess that's for the next time.

4. Sharing files and changes with each other through github was daunting. None of us had really collaborated on a single repo before, so we constantly had moments where something was working on one person's device but not in the other's.



# Tech/Service | Description
0. Next.js | Frontend framework for building React apps
1. Hardhat | Ethereum development environment for compiling, testing, and deploying smart contracts
2. Solidity | Smart contract programming language
3. MongoDB | NoSQL database for storing users, events, and hackathon data
4. Pinata | IPFS pinning service for storing event metadata like images
5. Alchemy | Used for Sepolia testnet RPC connection
6. JWT | For user authentication and session handling
Ethereum | Blockchain platform the contracts are deployed on
