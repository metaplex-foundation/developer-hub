// [IMPORTS]
import { createGenericFile } from '@metaplex-foundation/umi';
import { readFile } from 'fs/promises';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with irysUploader plugin
// See getting-started for full setup
// [/SETUP]

// [MAIN]
// Read image from local filesystem
const imageFile = await readFile('./my-nft-image.png');
const umiImageFile = createGenericFile(imageFile, 'my-nft-image.png', {
  contentType: 'image/png',
});

// Upload image to Arweave via Irys
const [imageUri] = await umi.uploader.upload([umiImageFile]);
// [/MAIN]

// [OUTPUT]
console.log('Image URI:', imageUri);
// [/OUTPUT]
