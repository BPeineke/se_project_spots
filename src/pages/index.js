import "../pages/index.css";
import {
  setButtonText,
  enableValidation,
  validationconfig,
  resetValidation,
} from "../scripts/validation.js";

import "./index.css";
import Api from "../utils/api.js";
const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "e61771ba-7eae-46c5-9016-6baccd09cc6b",
    "Content-Type": "application/json",
  },
});

let currentUserId;

api
  .getAppInfo()
  .then(({ cards, userData }) => {
    console.log("Data loaded successfully:", { cards, userData });

    // Display user profile information
    profileAvatar.src = userData.avatar;
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;

    // Render cards to the page
    cards.forEach((card) => {
      cardsList.prepend(getCardElement(card));
    });
  })
  .catch((err) => {
    console.error("An error occurred when loading data:", err);
    console.error("Full error object:", err);
  });
const profileAvatar = document.querySelector(".profile__avatar");
const profileEditButton = document.querySelector(".profile__edit-button");
const profileAvatarEditButton = document.querySelector(
  ".profile__avatar-edit-button"
);
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-profile-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button"
);
const avatarUrlInput = avatarModal.querySelector("#avatar-url-input");
const avatarSubmitBtn = avatarModal.querySelector(".modal__button");

const cardModal = document.querySelector("#add-card-modal");
const cardSubmitBtn = cardModal.querySelector(".modal__button");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalButton = document.querySelector(".profile__add-button");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

function handleLike(button, data) {
  console.log("handleLike called", data);
  if (data._id) {
    const isLiked = data.likes
      ? data.likes.some((like) => like._id === currentUserId)
      : false;
    console.log("isLiked", isLiked);
    const method = isLiked ? "unlikeCard" : "likeCard";
    api[method](data._id)
      .then((updatedCard) => {
        console.log("API success", updatedCard);
        data.likes = updatedCard.likes;
        button.classList.toggle("card__like-button_liked");
      })
      .catch(console.error);
  } else {
    // For initial cards without _id, just toggle the class locally
    button.classList.toggle("card__like-button_liked");
  }
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  let selectedCard, selectedCardId; //

  // If the card is liked set the active class on the card

  const deleteModal = document.querySelector("#confirm-delete-modal");
  const cardDeleteConfirmButton = deleteModal.querySelector(
    ".modal__delete-button_type_preview"
  );
  const cardCancelConfirmButton = deleteModal.querySelector(
    ".modal__cancel-button_type_preview"
  );
  const button = cardDeleteConfirmButton;

  const handleCancelSubmit = (evt) => {
    closeModal(deleteModal); // close the modal
  };
  const handleDeleteSubmit = (evt) => {
    setButtonText(button, true, "Delete", "Deleting..."); // show loading state
    if (selectedCardId) {
      api
        .deleteCard(selectedCardId) // optional API call
        .then(() => {
          selectedCard.remove(); // remove the card from the page
          closeModal(deleteModal); // close the modal
        })
        .catch(console.error)
        .finally(() => setButtonText(button, false, "Delete", "Deleting...")); // reset button text
    } else {
      selectedCard.remove(); // remove the card from the page
      closeModal(deleteModal); // close the modal
      setButtonText(button, false, "Delete", "Deleting..."); // reset button text
    }
  };

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.likes && data.likes.some((like) => like._id === currentUserId)) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  function handleDeleteCard(element, data) {
    selectedCard = element; // store the DOM element of the card
    selectedCardId = data._id; // store the card’s ID for API deletion
  }
  cardDeleteButton.addEventListener("click", (event) => {
    openModal(deleteModal); // show the confirmation modal
    const cardElement = event.target.closest(".card");
    handleDeleteCard(cardElement, data);

    //
    // }
  });

  cardDeleteConfirmButton.addEventListener("click", handleDeleteSubmit);

  cardCancelConfirmButton.addEventListener("click", handleCancelSubmit);

  cardImageEl.addEventListener("click", () => {
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    openModal(previewModal);
  });

  cardLikeButton.addEventListener("click", () =>
    handleLike(cardLikeButton, data)
  );

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("mousedown", handleOverlayClick);
  document.addEventListener("keydown", handleEscKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("mousedown", handleOverlayClick);
  document.removeEventListener("keydown", handleEscKey);
}
function handleEscKey(e) {
  if (e.key === "Escape") {
    const currentModal = document.querySelector(".modal_opened");
    if (currentModal) {
      closeModal(currentModal);
    }
  }
}

function handleOverlayClick(e) {
  if (e.target.classList.contains("modal_opened")) {
    closeModal(e.target);
  }
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const newAvatarUrl = avatarUrlInput.value.trim();

  // Enhanced validation: Must be https and end with image extension
  const urlPattern = /^https:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i;
  if (!urlPattern.test(newAvatarUrl)) {
    alert(
      "Please enter a valid HTTPS image URL (e.g., https://example.com/image.jpg)"
    );
    return;
  }

  console.log("Sending avatar URL to API:", newAvatarUrl);
  setButtonText(avatarSubmitBtn, true, "Save", "Saving...");
  api
    //.updateUserInfo({ avatar: newAvatarUrl })
    //.then((userData) => {
    //  console.log("Avatar updated successfully:", userData);
    //   profileAvatar.src = userData.avatar;
    //   closeModal(avatarModal);
    //})
    .updateAvatar(newAvatarUrl)
    .then((userData) => {
      profileAvatar.src = userData.avatar;
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error("Error updating avatar:", err);
      alert("Failed to update avatar. Please check the URL and try again.");
    })
    .finally(() => setButtonText(avatarSubmitBtn, false, "Save", "Saving..."));
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  setButtonText(cardSubmitBtn, true, "Save", "Saving...");
  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };
  api
    .addCard(inputValues)
    .then((newCard) => {
      const cardElement = getCardElement(newCard);
      cardList.prepend(cardElement);
      evt.target.reset();
      disableButton(cardSubmitBtn, validationconfig);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(cardSubmitBtn, false, "Save", "Saving...");
      closeModal(cardModal);
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationconfig
  );
  openModal(editModal);
});

profileAvatarEditButton.addEventListener("click", () => {
  avatarUrlInput.value = profileAvatar.src;
  resetValidation(avatarFormElement, [avatarUrlInput], validationconfig);
  openModal(avatarModal);
});

editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardList.prepend(cardElement);
});
enableValidation(validationconfig);
