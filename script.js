
"use strict";

/* =========================================
   ATLANTIDA RESORT
   Mobile menu, gallery and booking form
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // 1. CURRENT YEAR IN FOOTER

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // 2. MOBILE NAVIGATION

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("navigation");

  function closeMenu() {
    if (!menuToggle || !navigation) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Открыть меню" : "Закрыть меню"
      );

      navigation.classList.toggle("open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }


  // 3. GALLERY AND FULL-SCREEN VIEWER

  const galleryButtons = Array.from(
    document.querySelectorAll(".gallery-item[data-image]")
  );

  const lightbox = document.getElementById("lightbox");

  if (galleryButtons.length && lightbox) {
    const lightboxImage = lightbox.querySelector("img");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const previousButton = lightbox.querySelector(".lightbox-prev");
    const nextButton = lightbox.querySelector(".lightbox-next");
    const counter = lightbox.querySelector(".lightbox-counter");

    /*
      These filenames must match the files in your assets folder.
      The spelling and uppercase/lowercase letters matter on GitHub.
    */

    const galleryPhotos = {
      dome: {
        src: "assets/IMG_5735.jpeg",
        alt: "Купол ATLANTIDA RESORT на закате"
      },

      cabins: {
        src: "assets/IMG_5741.jpeg",
        alt: "Каменная кабинка ATLANTIDA RESORT"
      },

      restaurant: {
        src: "assets/IMG_5742(1).jpeg",
        alt: "Интерьер ресторана ATLANTIDA RESORT"
      },

      terrace: {
        src: "assets/IMG_5736.jpeg",
        alt: "Территория и терраса ATLANTIDA RESORT"
      }
    };

    let activeIndex = 0;
    let previousFocus = null;

    function updateGallery(index) {
      activeIndex =
        (index + galleryButtons.length) % galleryButtons.length;

      const button = galleryButtons[activeIndex];
      const photo = galleryPhotos[button.dataset.image];

      if (!photo) return;

      lightboxImage.src = photo.src;
      lightboxImage.alt = photo.alt;

      if (counter) {
        counter.textContent =
          `${String(activeIndex + 1).padStart(2, "0")} / ` +
          `${String(galleryButtons.length).padStart(2, "0")}`;
      }
    }

    function openGallery(index) {
      previousFocus = document.activeElement;

      updateGallery(index);

      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");

      closeButton.focus();
    }

    function closeGallery() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");

      lightboxImage.removeAttribute("src");

      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    }

    galleryButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        openGallery(index);
      });
    });

    closeButton.addEventListener("click", closeGallery);

    previousButton.addEventListener("click", () => {
      updateGallery(activeIndex - 1);
    });

    nextButton.addEventListener("click", () => {
      updateGallery(activeIndex + 1);
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeGallery();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("open")) return;

      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        updateGallery(activeIndex - 1);
      }

      if (event.key === "ArrowRight") {
        updateGallery(activeIndex + 1);
      }
    });

    // Support horizontal swipe gestures on touchscreens.

    let touchStartX = 0;
    let touchStartY = 0;

    lightboxImage.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].screenX;
      touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });

    lightboxImage.addEventListener("touchend", (event) => {
      const deltaX =
        event.changedTouches[0].screenX - touchStartX;

      const deltaY =
        event.changedTouches[0].screenY - touchStartY;

      if (
        Math.abs(deltaX) > 55 &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        updateGallery(
          deltaX < 0 ? activeIndex + 1 : activeIndex - 1
        );
      }
    }, { passive: true });
  }


  // 4. BOOKING FORM

  const bookingForm = document.getElementById("booking-form");
  const formStatus = document.getElementById("form-status");
  const dateInput = document.getElementById("visit-date");

  if (dateInput) {
    const now = new Date();

    const localDate = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    dateInput.min = localDate;
  }

  if (bookingForm && formStatus) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      formStatus.textContent = "";

      if (!bookingForm.reportValidity()) {
        return;
      }

      const formData = new FormData(bookingForm);

      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const date = String(formData.get("date") || "");
      const space = String(formData.get("space") || "");
      const message = String(formData.get("message") || "").trim();

      if (!name || !phone || !date || !space) {
        formStatus.textContent =
          "Пожалуйста, заполните все обязательные поля.";
        return;
      }

      /*
        The form currently runs in demo mode.
        No information is sent to a server or saved remotely.
        A real booking channel must be connected separately.
      */

      const bookingDetails = [
        "ЗАЯВКА ATLANTIDA RESORT",
        "",
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Дата визита: ${date}`,
        `Бронирование: ${space}`,
        message ? `Комментарий: ${message}` : ""
      ].filter(Boolean).join("\n");

      formStatus.textContent =
        "Форма заполнена. Сейчас заявка ещё не отправлена. " +
        "Следующим шагом подключим реальный канал бронирования.";

      // Keep the prepared text available for the next integration step.
      bookingForm.dataset.bookingReady = "true";
      bookingForm.dataset.bookingDetails = bookingDetails;
    });
  }


  // 5. FRIENDLY IMAGE-LOADING FALLBACK

  document.querySelectorAll(".hero-background, .space-image, .gallery-photo")
    .forEach((element) => {
      element.addEventListener("contextmenu", (event) => {
        // Do not block normal browser behavior.
      });
    });

});
