const dropdown_menu = document.getElementById("responsive-links")
const hamburger = document.getElementById("hamburger-menu");

hamburger.addEventListener("click", responsive_menu)
dropdown_menu.addEventListener("click", responsive_menu)

window.addEventListener("scroll", () => dropdown_menu.classList="hidden")

function responsive_menu() {
    if (dropdown_menu.classList == "hidden") {
        dropdown_menu.classList = ""
    } else {
        dropdown_menu.classList += "hidden"
    }
}