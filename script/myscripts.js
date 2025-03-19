document.addEventListener("DOMContentLoaded", function () {


  const details = JSON.parse(localStorage.getItem("details"))
  if (details) {
    document.querySelector('input[name="entry.5640062"]').value = details.name;
    document.getElementById("gformLink").value = details.gformLink;
  }

  // Set today's date in the "Date of the session Attended" field
  const today = new Date();
  const formattedDatee = today.toISOString().split("T")[0].split("-").reverse().join("-");
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  // Find the date input field by its name attribute (entry.2113817863)
  const dateInput = document.querySelector('input[name="entry.2113817863"]');
  const sessionId = document.querySelector('input[name="entry.1826535476"]');
  const sessionTime = document.querySelector('input[name="entry.479418130"]');
  if (dateInput) {
    dateInput.value = formattedDate;
  }
  fetch("./sessions.json")
    .then((res) => res.json())
    .then((data) => {
      const todaySession = data.find((session) => session.date === formattedDatee);

      if (todaySession) {
        sessionId.value = todaySession.sessionId;
        let hour = todaySession.startTime.split(":")[0];
        let minute = todaySession.startTime.split(":")[1];

        if (minute == "00") minute = ""
        else minute = ":" + minute
        sessionTime.value = hour >= 12 ? `${hour - 12}${minute} PM` : `${hour}${minute} AM`;
        const subjectRadio = document.querySelector(`input[name="entry.1538401431"][value="${todaySession.subject}"]`);
        if (subjectRadio) {
          subjectRadio.checked = true;
        }
      } else {
        console.warn("No session found for today.");
        alert("Slots aren't updated yet")
      }
    })
    .catch((err) => { 
      alert("Error! Please do it manually")
      console.error("Error:", err) });


});

function submitForm() {


  // Extract values from the form fields using their entry IDs
  const college = encodeURIComponent("Saveetha Engineering College"); // Dropdown, default to the only option

  const studentName = encodeURIComponent(document.querySelector('input[name="entry.5640062"]').value || "");
  const attended = document.querySelector('select[name="entry.2020901070"]')?.value || "";
  const sessionId = encodeURIComponent(document.querySelector('input[name="entry.1826535476"]').value || "");
  const sessionDate = encodeURIComponent(document.querySelector('input[name="entry.2113817863"]').value || "");
  const startTime = encodeURIComponent(document.querySelector('input[name="entry.479418130"]').value || "");
  const subject = document.querySelector('input[name="entry.1538401431"]:checked')?.value || "";
  const contentRating = document.querySelector('input[name="entry.1360779365"]:checked')?.value || "";
  const engagementRating = document.querySelector('input[name="entry.1583983690"]:checked')?.value || "";
  const materialsRating = document.querySelector('input[name="entry.1921200463"]:checked')?.value || "";
  const practicalRating = document.querySelector('input[name="entry.111970851"]:checked')?.value || "";
  const lengthRating = document.querySelector('input[name="entry.1802854015"]:checked')?.value || "";
  const platformRating = document.querySelector('input[name="entry.288981890"]:checked')?.value || "";
  const explanationRating = document.querySelector('input[name="entry.285324898"]:checked')?.value || "";
  const alignmentRating = document.querySelector('input[name="entry.1126771271"]:checked')?.value || "";
  const satisfactionRating = document.querySelector('input[name="entry.2135882849"]:checked')?.value || "";
  const feedback = encodeURIComponent(document.querySelector('textarea[name="entry.1308303995"]').value || "");

  // Base URL for the Google Form pre-filled link


  const siteLink = document.getElementById("gformLink").value;
  // Construct the query string using the form's entry IDs

  const queryString = `?entry.1637387707=${college}&entry.5640062=${studentName}&entry.2020901070=${attended}&entry.1826535476=${sessionId}&entry.2113817863=${sessionDate}&entry.479418130=${startTime}&entry.1538401431=${subject}&entry.1360779365=${contentRating}&entry.1583983690=${engagementRating}&entry.1921200463=${materialsRating}&entry.111970851=${practicalRating}&entry.1802854015=${lengthRating}&entry.288981890=${platformRating}&entry.285324898=${explanationRating}&entry.1126771271=${alignmentRating}&entry.2135882849=${satisfactionRating}&entry.1308303995=${feedback}`;
  // Display the result as a clickable link with a copy button
  localStorage.setItem("details", JSON.stringify({ name: document.querySelector('input[name="entry.5640062"]').value, gformLink: siteLink }))
  const resultDiv = document.getElementById("result") || document.createElement("div");
  resultDiv.id = "result";
  resultDiv.innerHTML = `<button id="copyButton">Copy Link</button><a href="${siteLink}${queryString}" target="_blank">Open Pre-filled Form Link</a>`;
  document.body.appendChild(resultDiv);
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })

  // Add copy functionality
  document.getElementById("copyButton").addEventListener("click", function () {
    navigator.clipboard.writeText(`${siteLink}${queryString}`);
    this.style.backgroundColor = "grey";
    alert("Copied!")
  });
}