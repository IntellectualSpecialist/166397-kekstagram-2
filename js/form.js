import { isEscKey } from './utils.js';

const bodyElement = document.querySelector('body');
const formElemet = bodyElement.querySelector('.img-upload__form');
const modalFormElement = formElemet.querySelector('.img-upload__overlay');
const uploadControlElement = formElemet.querySelector('.img-upload__input');
const modalFormCloseElement = modalFormElement.querySelector('.img-upload__cancel');
const hashtagsFieldElement = modalFormElement.querySelector('.text__hashtags');
const descriptionFieldElement = modalFormElement.querySelector('.text__description');

const pristine = new Pristine(formElemet, {
  classTo: 'img-upload__field-wrapper', // Элемент, на который будут добавляться классы
  errorTextParent: 'img-upload__field-wrapper', // Элемент, куда будет выводиться текст с ошибкой
  errorTextTag: 'div', // Тег, который будет обрамлять текст ошибки
  errorTextClass: 'img-upload__field-wrapper--error' // Класс для элемента с текстом ошибки
});
const hashtag = /^#[a-zа-яё0-9]{1,19}$/i;

const validateHashtag = (value) => hashtag.test(value);

const validateHashtagsField = (value) => {
  if (!value) {
    return true;
  }

  const hashtags = value.trim().split(/\s+/);

  return hashtags.every((item) => validateHashtag(item)) && hashtags.length <= 5 && new Set(hashtags).size === hashtags.length;
};

const validateDescriptionField = (value) => value.length <= 140;

const getHashtagsErrorMessage = (value) => {
  const hashtags = value.trim().split(/\s+/);

  if (!hashtags.every((item) => validateHashtag(item))) {
    return 'Невалидный хэштег';
  }

  if (new Set(hashtags).size !== hashtags.length) {
    return 'Хэштеги повторяются';
  }

  if (hashtags.length > 5) {
    return 'Не более 5 хэштегов';
  }
};

pristine.addValidator(hashtagsFieldElement, validateHashtagsField, getHashtagsErrorMessage);
pristine.addValidator(descriptionFieldElement, validateDescriptionField, 'Не больше 140 символов');

formElemet.addEventListener('submit', (evt) => {
  evt.preventDefault();
  if (pristine.validate()) {
    formElemet.submit();
  }
});

const onDocumentKeydown = (evt) => {
  if (isEscKey(evt)) {
    if (evt.target.matches('.text__description')) {
      evt.stopPropagation();
    } else {
      evt.preventDefault();
      closeModalForm();
    }
  }
};

function openModalForm() {
  modalFormElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
}

function closeModalForm() {
  modalFormElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  formElemet.reset();
}

const initModalForm = () => {
  uploadControlElement.addEventListener('change', () => {
    openModalForm();
  });

  modalFormCloseElement.addEventListener('click', () => {
    closeModalForm();
  });
};

export { initModalForm };
