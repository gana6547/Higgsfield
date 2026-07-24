
//every time we creaing video we spend $2 dollers so we have to be carefull
export async function generateVideo(userPrompt:string,imageUrls:string[],outPutPath:string){
     

const headers = {
  Authorization: `Bearer ${process.env.API_KEY}`,
  'Content-Type': 'application/json',
};

// Step 1: Submit the generation request
const response = await fetch('https://openrouter.ai/api/v1/videos', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    model: 'google/veo-3.1',
    prompt: userPrompt ,
    durartion:8,
    generateAudio:false,
    input_references:imageUrls.map(imageUrl => ({
         "type": "image_url",
        "image_url": {
        "url": imageUrl
      }
    }))
  }),
});

const result = await response.json();
const jobId = result.id;
const pollingUrl = result.polling_url;
console.log(`Job submitted: ${jobId}`);
console.log(`Status: ${result.status}`);

// Step 2: Poll until completion
while (true) {
  await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds
  const pollResponse = await fetch(pollingUrl, { headers });
  const status = await pollResponse.json();

  console.log(`Status: ${status.status}`);

  if (status.status === 'completed') {
    // Step 3: Download the video
    const contentUrl = status.unsigned_urls[0];
    const videoResponse = await fetch(contentUrl);
    const videoBuffer = await videoResponse.arrayBuffer();
    // Save or process the video buffer
    console.log(`Video ready: ${contentUrl}`);
    break;
  } else if (status.status === 'failed') {
    console.error(`Generation failed: ${status.error ?? 'Unknown error'}`);
    break;
  }
}
}