const newItemEvent = new Event("discord-notifications:new-item");

function toggleSwitch() {
    this.classList.toggle('active')
    this.parentElement.querySelector('[data-name="display_thumb"]').value = this.classList.contains('active')
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

function addNotificationItem() {
    const listHolder = document.querySelector('div.discord-notifications-list');
    const collapsibleItem = document.querySelector('div.collapsible-item').cloneNode(true);
    const collapsibleTitle = collapsibleItem.querySelector('[data-id="collapsible-title"]');
    const deleteItemButton = collapsibleItem.querySelector(".delete-notification");
    const avatarPreview = collapsibleItem.querySelector('[data-id="avatar-preview"]');
    const displayThumbSwitch = collapsibleItem.querySelector('[data-name="display_thumb-btn"]')

    function _setValue(elementId, value) {
        const element = collapsibleItem.querySelector(`[data-name="${elementId}"]`);
        element.value = value || '';
    }

    const values = {
        'title': null,
        'webhook_url': null,
        'username': null,
        'color': '#5F5F5F',
        'avatar': null,
        'feed': -1000
    }

    for (const key of Object.keys(values)) {
        _setValue(key, values[key]);
    }

    collapsibleItem.id = `collapsible-${listHolder.children.length}`;
    collapsibleTitle.innerText = "New Notification Item";
    collapsibleTitle.onclick = toggleCollapsible.bind(this, collapsibleItem.id);
    deleteItemButton.onclick = deleteNotification.bind(this, collapsibleItem.id);
    displayThumbSwitch.onclick = toggleSwitch;
    deleteItemButton.classList.remove('hidden');
    avatarPreview.src = '';


    listHolder.appendChild(collapsibleItem);
    toggleCollapsible(collapsibleItem.id);

    collapsibleItem.scrollIntoView({ behavior: "smooth" });
    document.dispatchEvent(newItemEvent);
}

function deleteNotification(id) {
    const item = document.getElementById(id);
    item.remove();
}

document.addEventListener('discord-notifications:open-config', () => {
    const displayThumbElements = document.querySelectorAll('[data-name="display_thumb-btn"]');
    displayThumbElements.forEach(displayThumb => {
        displayThumb.onclick = toggleSwitch;
    })
})