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

function loadEntryEmbed(from, to, i) {
    const entries = context.extensions['Discord Notifications'].configuration.entries_for_embed;
    const index = (i || from.selectedIndex) - 1;

    if (index < 0) return;

    const entry = entries[index];

    if (!entry) return;

    const title = to.querySelector('.embed-article-title');
    const author = to.querySelector('.embed-author');
    const body = to.querySelector('.embed-article-snippet');
    const tags = to.querySelector('.embed-tags');
    const thumbnail = to.querySelector('.embed-image img');
    const feed = to.querySelector('[data-id="embed-feedname"]');

    const content = document.createElement('span');
    content.innerHTML = entry.content;

    title.innerText = entry.title;
    author.innerText = entry.author;
    body.innerText = entry.content.substring(0, 2069);
    tags.innerText = entry.tags;
    if (!i) feed.innerText = from.options[index + 1].text
    thumbnail.src = (entry.thumbnail || { url: 'https://placehold.co/600x400/' }).url
}

function runDynamicUpdate() {
    dynamicTitleUpdate();
    dynamicEmbedUpdate('username', 'embed-username')
    dynamicEmbedUpdate('color', 'embed-body', null, (from, to) => {
        to.style.borderColor = from.value
    });
    dynamicEmbedUpdate('display_thumb', 'embed-image', 'discord-notifications:switch-toggle', (_, to, e) => {
        to.style.display = !e.detail.isActive ? 'none' : 'block'
    });
    dynamicEmbedUpdate('feed', 'embed-element', 'input', (from, to) => loadEntryEmbed(from, to));
}

['discord-notifications:open-config', 'discord-notifications:new-item'].forEach(event => {
    document.addEventListener(event, () => {
        loadAvatarPreview();
        runDynamicUpdate();

        if (event == 'discord-notifications:new-item') return;

        const collapsibleItems = document.querySelectorAll('.collapsible-item');
        collapsibleItems.forEach(collapsibleItem => {
            const index = parseInt(collapsibleItem.querySelector('[data-name="feed"]').selectedIndex);
            const embedElement = collapsibleItem.querySelector('[data-id="embed-element"]')
            loadEntryEmbed(
                collapsibleItem,
                embedElement,
                index
            );
        })
    })
})