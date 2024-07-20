function loadAvatarPreview() {
    const avatarElement = document.querySelector("input#avatar");
    const avatarPreview = document.querySelector("img#avatar-preview");

    if (!avatarElement || !avatarPreview) return;

    avatarElement.addEventListener('change', () => {
        const url = avatarElement.value;
        if (validUrl(url)) avatarPreview.src = url;
    })

    function validUrl(url) {
        if (!url) return;
        return /^https?:\/\//.test(url);
    }
}

async function checkForUpdate() {
    const alertElement = document.querySelector('div#new-version');
    if (!alertElement) return;

    const version = context.extensions["Discord Notifications"].configuration.version;

    const response = await fetch("https://raw.githubusercontent.com/Jacxk/FreshRSS-DiscordNotifications/main/metadata.json")
        .then(res => res.json());

    console.log(response);
    const current_version = Number(version);
    const new_version = response.version;

    if (new_version > current_version) {
        const alert = `<div class="alert" role="alert">
            A new version of Discord Notifications is available 
            <a href="https://github.com/Jacxk/FreshRSS-DiscordNotifications">here</a>.
        </div>`;

        alertElement.innerHTML = alert;
    }
}

function load() {
    checkForUpdate().catch(console.error);
    loadAvatarPreview();
}

const slider = document.querySelector('#slider');
if (slider) slider.addEventListener('freshrss:slider-load', load);
