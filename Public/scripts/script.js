let category = {
  dom_elements: {
    category_form: document.getElementById("categoryForm"),
    name_ele: document.getElementById("categoryName"),
    description_ele: document.getElementById("description"),
    file_ele: document.getElementById("formFile"),
  },

  getFormInput() {
    console.log("validating");
  },

  validate_category_form() {
    console.log("validating");
  },

  handleSubmit() {
    // don't run the script if the category form is not found
    if (!this.dom_elements.category_form) {
      return false;
    }
  },
};

category.handleSubmit();
