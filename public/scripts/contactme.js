const contact_form = document.getElementById("contact-form");
const open_close_btn = document.getElementById("open-close-button");
const contact_header = document.getElementById("contact-header");

const DOWN_POSITION = "-255px";
const UP_POSITION = "15px";

const ROTATED_UP = "rotate(0)";
const ROTATED_DOWN = "rotate(0.5turn)";

let form_is_opened = false;

function toggle_form() {
    contact_form.style.bottom = form_is_opened ? DOWN_POSITION : UP_POSITION;
    open_close_btn.style.transform = form_is_opened ? ROTATED_UP : ROTATED_DOWN;
    form_is_opened = ~form_is_opened;
}

function submit_form(event) {
    /* Make sure the default Form submit doesn't go through */
    event.preventDefault(); 
    
    /* Grab the form data using FormData */
    const form_data = new FormData(contact_form);

    /* Build our own URL encoded request body based on the form content */
    let form_pairs = []; 
    for (let [name, value] of form_data)
    {
        if (value ==="") continue;
        form_pairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
    }
    
    /* URL encode our data */
    let url_encoded_data = form_pairs.join("&").replace(/%20/g, "+");

    /* Send data */
    let req = new Request("https://hugobde.dev/contact_form", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: url_encoded_data
    });
    fetch(req); 
}

contact_form.style.bottom = DOWN_POSITION;
contact_form.addEventListener("submit", submit_form);
