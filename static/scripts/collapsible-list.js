const newItemEvent = new Event("discord-notifications:new-item");

function toggleSwitch() {
    const switchToggle = this.parentElement.querySelector('[data-name="display_thumb"]');

    this.classList.toggle('active')
    const isActive = this.classList.contains('active');
    switchToggle.value = isActive;

    const switchToggleEvent = new CustomEvent("discord-notifications:switch-toggle", { detail: { isActive } });
    switchToggle.dispatchEvent(switchToggleEvent);
}

function toggleCollapsible(id) {
    const element = document.getElementById(id);
    const content = document.querySelector(`#${id}>.collapsible-content`);

    element.classList.toggle("collapsible-active");

    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

function addNotificationItem(data = {}, open = true) {
    const listHolder = document.querySelector('div.discord-notifications-list');
    const collapsibleItem = document.querySelector('div.collapsible-item').cloneNode(true);
    const collapsibleTitle = collapsibleItem.querySelector('[data-id="collapsible-title"]');
    const deleteItemButton = collapsibleItem.querySelector('[data-id="delete-item"]');
    const avatarPreview = collapsibleItem.querySelector('[data-id="avatar-preview"]');
    const displayThumbSwitch = collapsibleItem.querySelector('[data-name="display_thumb-btn"]')
    const embedBody = collapsibleItem.querySelector('[data-id="embed-body"]')

    function _setValue(elementId, value) {
        const element = collapsibleItem.querySelector(`[data-name="${elementId}"]`);
        element.value = value || '';
    }

    const values = {
        title: data.title,
        webhook_url: data.webhook_url,
        username: data.username,
        color: data.color || '#5F5F5F',
        avatar: data.avatar,
        feed: data.feed || -1000,
        display_thumb: data.display_thumb || 'true'
    }

    for (const key of Object.keys(values)) {
        _setValue(key, values[key]);
    }

    collapsibleItem.id = `collapsible-${listHolder.children.length}`;
    collapsibleTitle.innerText = data.title || "New Notification Item";
    collapsibleTitle.onclick = toggleCollapsible.bind(this, collapsibleItem.id)
    deleteItemButton.onclick = removeItem.bind(this, collapsibleItem.id);
    displayThumbSwitch.onclick = toggleSwitch;
    deleteItemButton.classList.remove('hidden');
    avatarPreview.src = data.avatar || '';
    embedBody.style.borderColor = values.color

    if (data.display_thumb === 'true') toggleSwitch.call(displayThumbSwitch)

    listHolder.appendChild(collapsibleItem);
    if (open) toggleCollapsible(collapsibleItem.id);

    collapsibleItem.scrollIntoView({ behavior: "smooth" });
    document.dispatchEvent(newItemEvent);
}

function removeItem(id) {
    const item = document.getElementById(id);
    item.remove();
}

function removeItems() {
    const listHolder = document.querySelector('div.discord-notifications-list');
    listHolder.innerHTML = ''
}

document.addEventListener('discord-notifications:open-config', () => {
    const displayThumbElements = document.querySelectorAll('[data-name="display_thumb-btn"]');
    displayThumbElements.forEach(displayThumb => {
        displayThumb.onclick = toggleSwitch;
    })
})