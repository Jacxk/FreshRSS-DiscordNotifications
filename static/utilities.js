const configOpenEvent = new Event("discord-notifications:open-config");

const slider = document.querySelector('#slider');
if (slider) slider.addEventListener('freshrss:slider-load', () => {
    setTimeout(() => {
        const title = document.querySelector('div.post>h2');

        if (title && title.innerText.includes("Discord Notifications")) {
            document.dispatchEvent(configOpenEvent);
        }
    }, 10);
});

document.addEventListener('discord-notifications:open-config', () => {
    document.getElementById('download-config').onclick = () => {
        const data = JSON.stringify(getData(), null, 2)
        createFileAndDownload('discord-notifications.backup.json', data)
    }

    document.getElementById('import-config').onclick = () => {
        const element = document.createElement('input');
        element.type = 'file';
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        const onFileLoad = (contents) => {
            try {
                const json = JSON.parse(contents) || [];
                json.forEach(data => addNotificationItem(data, false))
                sendAlert("Don't forget to save for the changes to appear.")
            } catch (error) {
                sendAlert('Invalid file was provided. Are you using the corrent JSON file?')
            }
        }

        element.onchange = (e) => handleFile(e, onFileLoad);
    }

    checkForUpdate().catch(console.error)
})

function validUrl(url) {
    if (!url) return;
    return /^https?:\/\//.test(url);
}

function createFileAndDownload(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function handleFile(event, callback) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => callback(e.target.result)

    reader.readAsText(file);
}

function getData() {
    const body = []
    const collapsibleItems = document.querySelectorAll(".collapsible-item");
    collapsibleItems.forEach(collapsibleItem => {
        const title = collapsibleItem.querySelector('[data-name="title"]').value;
        const webhook_url = collapsibleItem.querySelector('[data-name="webhook_url"]').value;
        const username = collapsibleItem.querySelector('[data-name="username"]').value;
        const color = collapsibleItem.querySelector('[data-name="color"]').value;
        const avatar = collapsibleItem.querySelector('[data-name="avatar"]').value;
        const feed = collapsibleItem.querySelector('[data-name="feed"]').value;
        const display_thumb = collapsibleItem.querySelector('[data-name="display_thumb"]').value;

        const data = {
            title,
            webhook_url,
            username,
            color,
            avatar,
            feed,
            display_thumb,
        };

        body.push(data);
    })

    return body;
}

async function checkForUpdate() {
    const version = context.extensions["Discord Notifications"].configuration.version;

    const response = await fetch("https://raw.githubusercontent.com/Jacxk/FreshRSS-DiscordNotifications/main/metadata.json")
        .then(res => res.json());

    const current_version = Number(version);
    const new_version = response.version;

    if (new_version > current_version) {
        sendAlert('A new version of Discord Notifications is available ' +
            '<a href = "https://github.com/Jacxk/FreshRSS-DiscordNotifications" > here</a >.')
    }
}

function sendAlert(html) {
    const alertElement = document.querySelector('div#extension-alerts');
    alertElement.style.display = 'block'
    alertElement.innerHTML = html;
}