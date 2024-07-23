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

document.addEventListener('discord-notifications:open-config', () => {
    loadAvatarPreview();
    dynamicTitleUpdate();
})



document.addEventListener('discord-notifications:new-item', dynamicTitleUpdate)