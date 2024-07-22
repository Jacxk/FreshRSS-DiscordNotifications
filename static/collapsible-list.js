const newItemEvent = new Event("discord-notifications:new-item");

function enableSwitch() {
    function toggleSwitch() {
        this.classList.toggle('active')
        this.parentElement.querySelector('[data-name="use_external"]').value = this.classList.contains('active')
    }

    const useExternalElements = document.querySelectorAll('[data-name="use_external-btn"]')
    useExternalElements.forEach(useExternal => {
        useExternal.addEventListener('click', toggleSwitch)
    })
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
    deleteItemButton.classList.remove('hidden')
    avatarPreview.src = ''


    listHolder.appendChild(collapsibleItem);
    toggleCollapsible(collapsibleItem.id);
    enableSwitch();

    collapsibleItem.scrollIntoView({ behavior: "smooth" })
    document.dispatchEvent(newItemEvent);
}

function deleteNotification(id) {
    const item = document.getElementById(id);
    item.remove()
}

document.addEventListener('discord-notifications:open-config', enableSwitch)