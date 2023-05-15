const modal = document.getElementById("modal");

function closeModal() {
    modal.classList.add("modalFadeOut");
    setTimeout(() => modal.style.display = "none" ,700);
    document.body.style.overflow = "scroll";
    document.cookie = "alreadyvisited";
}

function showModal() {
    if (document.cookie === "alreadyvisited") return;
    modal.style.display = "flex";
    modal.classList.add("modalFadeIn");
    setTimeout(() => modal.classList.remove("modalFadeIn"), 750);
    window.scroll(0,0);
    document.body.style.overflow = "hidden";
}

showModal();
