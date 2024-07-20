const avatarElement = document.querySelector("input#avatar");
const avatarPreview = document.querySelector("img#avatar-preview")

avatarElement.addEventListener('change', () => {
    const url = avatarElement.value;

    if (validUrl(url)) avatarPreview.src = url;
})

function validUrl(url) {
    if (!url) return;
    return /^https?:\/\//.test(url);
}
