// Add this import at the top of your file
const { Readable } = require('stream');

const pinataSDK = require('@pinata/sdk');

async function uploadImageToPinata(fileBuffer, fileName, mimeType) {
  try {
    const PINATA_API_KEY = process.env.PINATA_API_KEY;
    const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
    
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      throw new Error('Pinata API keys not defined in environment variables');
    }
    
    const pinata = new pinataSDK(PINATA_API_KEY, PINATA_SECRET_API_KEY);
    
    // Convert buffer to a file object that Pinata can use
    const readableStreamForFile = new Readable();
    readableStreamForFile.push(fileBuffer);
    readableStreamForFile.push(null);
    
    const options = {
      pinataMetadata: {
        name: fileName
      }
    };
    
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

module.exports = {
  uploadImageToPinata
};