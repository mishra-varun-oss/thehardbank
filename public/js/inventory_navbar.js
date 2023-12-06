document.addEventListener("DOMContentLoaded", function() {
  const menuIcon = document.getElementById("navbarMenuIcon");
  const navbarLinks = document.getElementById("navbarLinks");

  menuIcon.addEventListener("click", function() {
    navbarLinks.classList.toggle("active");
    menuIcon.classList.toggle("active");
  });
});
