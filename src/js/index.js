import "../css/style.css";
import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const KEY = "32757716-8b0663aad2250c5619ecf300f";
const URL = `https://pixabay.com/api/?key=${KEY}`;
const form = document.getElementById("search-form");
// const load = document.querySelector(".load");
const gallery = document.querySelector(".gallery");
let page = 1;
// load.style.display = "none";

const options = {
  method: "get",
  url: URL,
  params: {
    q: "yellow+flower",
    image_type: "photo",
    category: "animals",
    page: "1",
    per_page: "12",
  },
};

const getData = async () => {
  try {
    const response = await axios(options);
    const data = await response.data;
    return data.hits;
  } catch (error) {
    Notiflix.Notify.failure("Sorry, No more images to load");
  }
};

const processImages = (hits) => {
  const images = hits
    .map((hit) => {
      return `
      <div class="photo-card">

                <a href="${hit.largeImageURL}">
                  <img  src="${hit.webformatURL}" 
                   data-sorce="${hit.largeImageURL}"
                   alt=""
                   title="Upload by: ${hit.user}"
                   loading="lazy" />
                </a>

                <div class="info">
                      <p class="info-item">
                        <b>Likes ${hit.likes}</b>
                      </p>
                      <p class="info-item">
                        <b>Views ${hit.views}</b>
                      </p>
                      <p class="info-item">
                        <b>Comments ${hit.comments}</b>
                      </p>
                      <p class="info-item">
                        <b>Downloads ${hit.downloads}</b>
                      </p>
                </div>;
        </div>`;
    })
    .join("");

  gallery.innerHTML += images;
};

function processData() {
  getData().then((h) => {
    if (h.length > 0) {
      Notiflix.Notify.info(`"Hooray! We found ${h.length} images."`);
      processImages(h);
      // load.style.display = "block";
      const g_img = new SimpleLightbox(".gallery .photo-card a", {
        captions: true,
        captionAttribute: "title",
        captionDelay: 250,
      });

      g_img.on("show.simplelightbox", function (e) {});
    } else {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
    }
  });
}
function smooth() {
  console.log("smooth");
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

function changePage() {
  page += 1;
  options.params.page = page.toString();
  processData();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  gallery.innerHTML = "";

  const query = form.elements[0].value;
  if (!query) {
    Notiflix.Notify.warning("I cand find nothing with an empty query");
  } else {
    options.params.q = query;
    processData();
    if (parseInt(options.params.page) > 1) smooth();
  }
});

// load.addEventListener("click", (e) => {
//   changePage();
// });

window.addEventListener("scroll", (e) => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight) {
    changePage();
  }
});
