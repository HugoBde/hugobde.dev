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

function submit_form() {

}

contact_form.style.bottom = DOWN_POSITION;
