const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const search = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const durationId = document.getElementById("duration");
const sliderContainer = document.getElementById("sliders");
const noResult = document.getElementById("no-result");
const sppiner = document.getElementById("sppiner");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// ================ show images function ==============

const showImages = (images) => {
  if (images.length === 0) {
    noResult.classList.remove("d-none");
    gallery.innerHTML = "";
    galleryHeader.classList.add("d-none");
  } else {
    noResult.classList.add("d-none");
    galleryHeader.classList.remove("d-none");
    imagesArea.style.display = "block";
    gallery.innerHTML = "";

    // show gallery title
    galleryHeader.style.display = "flex";
    images?.forEach((image) => {
      let div = document.createElement("div");
      div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    });
  }
  sppiner.classList.add("d-none");
};

// ======================== loadApi =================

const getImages = (query) => {
  const url = `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => showImages(data.hits))
    .catch((err) => console.log(err));
};

let slideIndex = 0;

// ================ selectItem function =============

const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  }
  if (item !== -1) {
    const index = sliders.indexOf(img);
    delete sliders[index];
    element.classList.remove("added");
  }
};

let timer;
// ============= duration time function ===============
const durationTime = () => {
  const duration = durationId.value;
  durationId.value = "";

  let durationNumber = parseInt(duration);
  let durationTime;

  if (!durationNumber) {
    durationTime = 1000;
    durationId.classList.remove("warn");
  }
  if (durationNumber < 0 || durationNumber > 20) {
    imagesArea.style.display = "block";
    durationId.classList.add("warn");
  }
  if (durationNumber > 0 && durationNumber < 20) {
    durationId.classList.remove("warn");
    durationTime = durationNumber * 1000;
  }

  return durationTime;
};

// ================== createSlider function ============

const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";

  // hide image aria
  imagesArea.style.display = "none";

  const time = durationTime();

  if (time) {
    sliders.forEach((slide) => {
      let item = document.createElement("div");
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
      sliderContainer.appendChild(item);
    });

    changeSlide(0);
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, time);
  }
};

// ========== change slider index ===========
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

//============= change slide item ==============
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

// =============== searchFunction ===============

const searchHandler = () => {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);

  getImages(search.value);
  search.value = "";

  sliders.length = 0;
};

// ===================== removePrevies html ========================

const removeHtml = () => {
  durationId.classList.remove("warn");
  noResult.classList.add("d-none");
  gallery.innerHTML = "";
  galleryHeader.classList.add("d-none");
  sppiner.classList.remove("d-none");
};

// ==================== btn hendlar ===============

searchBtn.addEventListener("click", function () {
  removeHtml();
  searchHandler();
});

// ====================== slider btn ==============

sliderBtn.addEventListener("click", function () {
  createSlider();
});

// ================ search input handler ==========

search.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    removeHtml();
    searchHandler();
  }
});
// ===================== slider input handler ====================

durationId.addEventListener("keypress", (e) => {
  durationId.classList.remove("warn");
  if (e.key === "Enter") {
    createSlider();
  }
});
