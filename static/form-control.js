document.addEventListener('discord-notifications:open-config', () => {
    let error;
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

            if (!webhook_url) error = `You need to provide the Webhook URL to '${title}'`;
            if (!validUrl(webhook_url)) error = `The Webhook URL of '${title}' is invalid`;

            body.push(data);
        })

        return body;
    }

    const form = document.getElementById('extention-form');
    form.addEventListener('submit', (e) => {
        const data = JSON.stringify(getData());

        document.querySelector('[name="discord-notifications-data"]').value = data
    })
})