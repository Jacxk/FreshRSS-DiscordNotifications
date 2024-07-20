function loadAvatarPreview() {
    const avatarElement = document.querySelector("input#avatar");
    const avatarPreview = document.querySelector("img#avatar-preview");

    if (!avatarElement || !avatarPreview) return;

    avatarElement.addEventListener('change', () => {
        const url = avatarElement.value;

        console.log(url)
        if (validUrl(url)) avatarPreview.src = url;
    })

    function validUrl(url) {
        if (!url) return;
        return /^https?:\/\//.test(url);
    }
}

const slider = document.querySelector('#slider');
if (slider) slider.addEventListener('freshrss:slider-load', loadAvatarPreview)
