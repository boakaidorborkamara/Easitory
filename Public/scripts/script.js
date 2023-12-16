let category_form = document.getElementById("category-form");

const formValidation = {
  validateCategoryForm: (e) => {
    // stop execution if script doesn't find category form
    if (!category_form) {
      console.log("can't find");
      return;
    }

    // all elements that are included in the category form
    let form_elements = Array.from(category_form.elements);

    // let formData = new formData()
    category_form.addEventListener("submit", (e) => {
      e.preventDefault();
      form_elements.forEach((ele) => {
        console.log(ele.value);
      });
    });
  },
};

formValidation.validateCategoryForm();
