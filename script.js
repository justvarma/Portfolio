function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open")
    icon.classList.toggle("open")
}

window.onload = function () {
    if (performance.navigation.type === 1) {
        window.location.hash = "";
    }
};