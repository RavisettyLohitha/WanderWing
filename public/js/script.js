// Example starter JavaScript for disabling form submissions if there are invalid fields
() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
};
//Dropdown values working
const dropdownitems = document.querySelectorAll(".dropdown-item");
const categoryInput = document.querySelector("#categoryInput");
for (let category of dropdownitems) {
  category.addEventListener("click", () => {
    categoryInput.value = category.innerText;
  });
}
//taxes toggle switch
const taxSwitch = document.getElementById("switchCheckDefault");
let tax_info = document.querySelectorAll("#tax-info");
taxSwitch.addEventListener("click", () => {
  for (let taxes of tax_info) {
    taxes.classList.toggle("d-none");
  }
});
