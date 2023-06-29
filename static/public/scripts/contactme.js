const contact_form = document.getElementById("contact-form");
const open_close_btn = document.getElementById("open-close-button");
const contact_header = document.getElementById("contact-header");
const submit_btn = document.getElementById("submit");

const DOWN_POSITION = "-250px";
const UP_POSITION = "10px";

const ROTATED_UP = "rotate(0)";
const ROTATED_DOWN = "rotate(0.5turn)";

let form_is_opened = false;

function toggle_form() {
    if (window.matchMedia("(max-width: 600px)").matches) {
        contact_form.scrollIntoView();
        return;
    }
    contact_form.style.bottom = form_is_opened ? DOWN_POSITION : UP_POSITION;
    open_close_btn.style.transform = form_is_opened ? ROTATED_UP : ROTATED_DOWN;
    form_is_opened = ~form_is_opened;
}

async function submit_form(event) {
    /* Make sure the default Form submit doesn't go through */
    event.preventDefault(); 
   
    submit_btn.classList.add("sending"); 
    
    setTimeout(() => {
        submit_btn.innerHTML = "Sending...";
    }, 250); 

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
    let req = new Request("/contact_form", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: url_encoded_data
    });
    let response = await fetch(req);
    let outcome = response.ok ? "Sent!" : "An error occured";
    
    if (response.ok) 
    {
        contact_form.reset();
    }

    submit_btn.classList.remove("sending");
    
    setTimeout(() => {
        submit_btn.innerHTML = outcome;
    }, 250);

    setTimeout(() => {
        submit_btn.style.color = "white";
    }, 4500);
    
    setTimeout(() => {
        submit_btn.innerHTML = "Send message";
    }, 5000);

    setTimeout(() => {
        submit_btn.style.color = "black";
    }, 5500);
}

contact_form.style.bottom = DOWN_POSITION;
contact_form.addEventListener("submit", submit_form);
