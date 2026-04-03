
export default function displaybodychildren(url) {
    const body = document.querySelector("#body");
    body.appendChild(createHeader(url));
}

async function createHeader(url) {
  const header = document.createElement("header");
  header.classList = "header";
  header.id = "header";
  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = response.json();
      const logo = document.createElement("img");
      logo.classList = "site-logo";
      logo.id = "site-logo";
      logo.width = "2px";
      logo.height = "1px";
      logo.src = data.details.logourl;
      logo.alt = `${data.details.companyname} logo!`;

      const siteName = document.createElement("span");
      siteName.id = "site-name";
      siteName.classList = "site-name";
      siteName.innerText = data.details.companyname;

      header.appendChild(logo);
      header.appendChild(siteName);
    } else {
        const errorP = document.createElement("p");
        errorP.innerText = `Bad response. Status ${response.status}`
        header.appendChild(errorP);
    }
  } catch (error) {
      const catchP = document.createElement("p");
      catchP.textContent = `Error fetching url: ${error}`;
      header.appendChild(catchP);
  }
  return header;
}



