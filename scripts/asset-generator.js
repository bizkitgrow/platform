/**
 * Asset Generator communicating with Pollinations.ai infrastructure
 */
function generateImage(prompt) {
  console.log(
    '[ASSET-GENERATOR] Translating query into secure URL-encoded string for Pollinations.ai...',
  );

  const encodedPrompt = encodeURIComponent(prompt);
  const width = 1080;
  const height = 1080;
  const nologo = true;

  const url = `https://image.pollinations.ai/p/${encodedPrompt}?width=${width}&height=${height}&nologo=${nologo}`;

  return url;
}

module.exports = { generateImage };
