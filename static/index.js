const file_input = document.querySelector("#file");
const download_list = document.querySelector("#download-list");

const addToDownloads = ({ name, uri }) => {
  const li = document.createElement("li");
  li.innerHTML = `<a href=${uri} target="_blank">📁 ${name}</a>`;
  download_list.appendChild(li);
};

document
  .querySelector("#btn-upload")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const upload_button = event.target;

    if (file_input.files.length) {
      upload_button.textContent = "Uploading...";
      upload_button.disabled = true;

      const form_data = new FormData();
      form_data.append("file", file_input.files[0]);

      try {
        const response = await fetch("/upload", {
          method: "POST",
          body: form_data,
        });
        if (response.status == 200) {
          const data = await response.json();
          addToDownloads(data);
        } else {
          alert("Oops! Upload failed.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        upload_button.textContent = "Upload";
        upload_button.disabled = false;
      }
    }

    file_input.value = "";
  });
