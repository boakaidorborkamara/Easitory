// accepts a file info and return base64 string
async function readFile(file) {
  return new Promise((resolve, reject) => {
    let file_base64_string = null;

    // create File Reader instance
    let file_reader = new FileReader();

    // load file content
    file_reader.onload = () => {
      file_base64_string = file_reader.result;
    };

    // return base64 string when file content is done loading
    file_reader.onloadend = () => {
      resolve((file_base64_string = file_reader.result));
    };

    // read file
    if (file) {
      file_reader.readAsDataURL(file);
    } else {
      console.log("no file selected");
    }
  });

  // return file_base64_string;
}

// handle category
let category = {
  dom_elements: {
    category_form: document.getElementById("categoryForm"),
    name_ele: document.getElementById("categoryName"),
    description_ele: document.getElementById("categoryDescription"),
    file_ele: document.getElementById("formFile"),
  },

  async getFormData() {
    console.log("reading file");
    let file = this.dom_elements.file_ele.files[0];
    console.log("File", file);

    let formData = {
      name: this.dom_elements.name_ele.value,
      description: this.dom_elements.description_ele.value,
      image: {
        file_details: { name: file.name, type: file.type },
        file_data: await readFile(file),
      },
    };

    console.log("form Data", formData);
    return formData;
  },

  validate_category_form() {
    console.log("validating");
  },

  async createNewCategory(data) {
    let url = "/categories";
    let category = await data;
    JSON.stringify(category);
    // category.toString();
    console.log("Data", category);

    fetch(url, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(category),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data.acknowledged === true) {
          alert("Sever Error! Unable to upload");
          return;
        }

        // show success message for 2sec and then redirect to catgories page
        setTimeout(() => {
          alert("Category added!");
          window.location.href = "/categories";
        }, 2000);
      });
  },

  handleSubmit() {
    // don't run the script if the category form is not found
    if (!this.dom_elements.category_form) {
      return false;
    }

    // submit form if form exist
    this.dom_elements.category_form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let categoryInfo = this.getFormData();
      this.createNewCategory(categoryInfo);
    });
  },
};

// handle items
let item = {
  dom_elements: {
    item_form: document.getElementById("itemForm"),
    name_ele: document.getElementById("itemName"),
    description_ele: document.getElementById("itemDescription"),
    file_ele: document.getElementById("formFile"),
    category_ele: document.getElementById("category"),
    items_amount: document.getElementById("items_amount"),
    price: document.getElementById("price"),
  },
};

category.handleSubmit();
console.log("DOM ELE", item.dom_elements);
