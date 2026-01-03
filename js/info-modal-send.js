import { isEscKey, findTemplateById } from './utils.js';

const bodyElement = document.querySelector('body');
const errorTemplateElement = findTemplateById('error');
const successTemplateElement = findTemplateById('success');

let modalElement;
let currentStatus;

const onBodyClick = (evt) => {
  if (!evt.target.closest(`.${currentStatus}__inner`)) {
    removeSendInfoModal();
  }
};

const onBodyKeydown = (evt) => {
  if (isEscKey(evt)) {
    evt.preventDefault();
    removeSendInfoModal();
    evt.stopPropagation();
  }
};

const createSendInfoModal = (message) => {
  const templateElement = currentStatus === 'success' ? successTemplateElement : errorTemplateElement;
  const templateModalElement = templateElement.cloneNode(true);
  const closeElement = templateModalElement.querySelector(`.${currentStatus}__button`);

  if (message) {
    templateModalElement.querySelector(`.${currentStatus}__title`).textContnet = message;
  }

  closeElement.addEventListener('click', () => {
    removeSendInfoModal();
  });

  return templateModalElement;
};

function renderSendInfoModal(status, message) {
  currentStatus = status;
  modalElement = createSendInfoModal(message);
  bodyElement.append(modalElement);
  bodyElement.addEventListener('keydown', onBodyKeydown);
  bodyElement.addEventListener('click', onBodyClick);
}

function removeSendInfoModal() {
  modalElement.remove();
  bodyElement.removeEventListener('keydown', onBodyKeydown);
  bodyElement.removeEventListener('click', onBodyClick);
}

export { renderSendInfoModal };
