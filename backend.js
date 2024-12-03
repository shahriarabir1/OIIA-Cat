document
  .getElementById("generateButton")
  .addEventListener("click", function () {
    // Trigger file input click when "Generate PFP" is clicked
    document.getElementById("fileInput").click();
  });

// Event listener for file selection
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      uploadAndProcessImage(file);
    }
  });

async function uploadAndProcessImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const generateButton = document.getElementById("generateButton");

  // Change button text to "Generating..." while processing
  generateButton.textContent = "Generating...";

  try {
    // Change the URL to the backend's correct URL
    const response = await fetch(
      "http://127.0.0.1:5000/generate_pfp",
      //   "https://generatebgremoval-production.up.railway.app/generate_pfp",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);

      // Trigger automatic download
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "generated_pfp.png";
      link.click();
    } else {
      const errorText = await response.text();
      console.error("Error Response: ", errorText);
      alert("Failed to process the image. Please try again.");
    }
  } catch (error) {
    console.error("Error uploading or processing the image:", error);
    alert("An error occurred while processing the image.");
  } finally {
    // Restore button text to "Generate PFP" after processing is done
    generateButton.textContent = "Generate PFP";
  }
}
