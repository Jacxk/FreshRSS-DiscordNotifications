function loadAvatarPreview() {
    const avatarElements = document.querySelectorAll('input[data-id="avatar"]');

    avatarElements.forEach(avatarElement => {
        let topParent = avatarElement.parentElement;
        'aa'.split('').map(_ => topParent = topParent.parentElement)

        const avatarsPreview = topParent.querySelectorAll('img[data-id="avatar-preview"]');

        avatarsPreview.forEach(avatarPreview => avatarElement.addEventListener('input', () => {
            const url = avatarElement.value;
            if (validUrl(url)) avatarPreview.src = url;
        }))
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

function dynamicEmbedUpdate(from, to, event = 'input', cb) {
    const elements = document.querySelectorAll(`[data-name="${from}"]`);

    elements.forEach(element => {
        let topParent = element.parentElement;
        'aa'.split('').map(_ => topParent = topParent.parentElement)

        const elementTo = topParent.querySelector(`[data-id="${to}"]`);

        element.addEventListener(event || 'input', (e) => {
            if (cb) return cb(element, elementTo, e);
            let text = element.value
            if (!text) text = `${from}`
            elementTo.innerText = text
        })
    })
}

function runDynamicUpdate() {
    dynamicTitleUpdate();
    dynamicEmbedUpdate('username', 'embed-username')
    dynamicEmbedUpdate('feed', 'embed-feedname', 'change', (from, to) => {
        to.innerText = from.options[from.selectedIndex].text
    })
    dynamicEmbedUpdate('color', 'embed-body', null, (from, to) => {
        to.style.borderColor = from.value
    });
    dynamicEmbedUpdate('display_thumb', 'embed-image', 'discord-notifications:switch-toggle', (_, to, e) => {
        to.style.display = !e.detail.isActive ? 'none' : 'block'
    });
}

['discord-notifications:open-config', 'discord-notifications:new-item'].forEach(event => {
    document.addEventListener(event, () => {
        loadAvatarPreview();
        runDynamicUpdate();
    })
})