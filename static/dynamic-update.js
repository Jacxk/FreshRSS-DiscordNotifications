const configOpenEvent = new Event("discord-notifications:open-config");

function validUrl(url) {
    if (!url) return;
    return /^https?:\/\//.test(url);
}

function loadAvatarPreview() {
    const avatarElements = document.querySelectorAll('input[data-id="avatar"]');

    avatarElements.forEach(avatarElement => {
        let topParent = avatarElement.parentElement;
        'aa'.split('').map(_ => topParent = topParent.parentElement)

        const avatarPreview = topParent.querySelector('img[data-id="avatar-preview"]');

        avatarElement.addEventListener('input', () => {
            const url = avatarElement.value;
            if (validUrl(url)) avatarPreview.src = url;
        })
    })
}

function dynamicTitleUpdate() {
    const titleElements = document.querySelectorAll('input[data-id="title"]');

    titleElements.forEach(titleElement => {
        let topParent = titleElement.parentElement;
        'aaa'.split('').map(_ => topParent = topParent.parentElement)

        const title = topParent.querySelector('h3[data-id="collapsible-title"]');

        titleElement.addEventListener('input', () => {
            let titleText = titleElement.value
            if (!titleText) titleText = 'New Notification Item'
            title.innerText = titleText
        })
    })
}

async function checkForUpdate() {
    const alertElement = document.querySelector('div#new-version');
    const version = context.extensions["Discord Notifications"].configuration.version;

    const response = await fetch("https://raw.githubusercontent.com/Jacxk/FreshRSS-DiscordNotifications/main/metadata.json")
        .then(res => res.json());

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

document.addEventListener('discord-notifications:open-config', () => {
    loadAvatarPreview();
    dynamicTitleUpdate();
    checkForUpdate().catch(console.error);
})

const slider = document.querySelector('#slider');
if (slider) slider.addEventListener('freshrss:slider-load', () => {
    setTimeout(() => {
        const title = document.querySelector('div.post>h2');

        if (title && title.innerText.includes("Discord Notifications")) {
            document.dispatchEvent(configOpenEvent);
        }
    }, 10);
});

document.addEventListener('discord-notifications:new-item', dynamicTitleUpdate)