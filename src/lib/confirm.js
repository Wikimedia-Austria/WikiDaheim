import dialogPolyfill from "dialog-polyfill";

const makeDialogContent = ({ content, title, cancelTitle, confirmTitle }) => `
  <form method="dialog" class="confirm-dialog">
    <h1>${title}</h1>
    <p>${content}</p>
    <div class="actions">
      <button value="cancel">${cancelTitle}</button>
      <button value="confirm">${confirmTitle}</button>
    </div>
  </form>
`;

const confirm = ({ content, title, cancelTitle, confirmTitle }) => {
  const dialog = document.createElement("dialog");

  dialogPolyfill.registerDialog(dialog);

  dialog.innerHTML = makeDialogContent({ content, title, cancelTitle, confirmTitle });
  document.body.appendChild(dialog);
  dialog.showModal();

  return new Promise((resolve) =>
    dialog.addEventListener("close", () => {
      resolve(dialog.returnValue === "confirm");
    })
  ).then((result) => {
    document.body.removeChild(dialog);

    return result;
  });
};

export default confirm;
