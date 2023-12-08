function openPopup(imageSrc, description) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <img src="${imageSrc}" alt="Popup Image">
        <p>${description}</p>
        <span class="close" onclick="closePopup()">&times;</span>
    `;
    document.body.appendChild(popup);
}

function closePopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
        document.body.removeChild(popup);
    }
}
function goBack() {
    // You can define the behavior of the back button here.
    // For example, you might want to navigate to a previous page or close a popup.
    // In this example, let's just go back in the browser's history.
    window.history.back();
}
