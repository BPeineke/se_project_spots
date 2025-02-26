const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgEl = formEl.querySelector("#${inputEl.id}-error");
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add("model__input_type_error");
};

const HideInputError = (formEl, inputEl) => {
  const errorMsgEl = formEl.querySelector("#${inputEl.id}-error");
  errorMsgEl.textContent = "";
  inputEl.classList.remove("model__input_type_error");
};

const checkInputValidity = (formEl, inputEl) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    HideInputError(formEl, inputEl);
  }
};

const hasInvalidInput = (inputList) => {
  inputList.some((input) => {
    return !input.validity.valid;
  });
};

const togglebuttonstate = (inputList, buttonEl) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonEl);
  } else {
    buttonEl.disabled = false;
  }
};

const disableButton = (buttonEl) => {
  buttonEl.disabled = true;
};

const resetValidation = (formEl, inputList) => {
  inputList.forEach((input) => {
    HideInputError(ormEl, input);
  });
};

const setEventListners = (formEl) => {
  const inputList = Array.form(formEl.querySelectorAll(".modal__input"));
  const buttonElement = formEl.queryselector(".modal__button");

  //toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    imputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");
  formList.forEach((formEl) => {
    setEventListners(formEl);
  });
};

enableValidation();
