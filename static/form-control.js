document.addEventListener('discord-notifications:open-config', () => {
    const form = document.getElementById('extention-form');
    form.addEventListener('submit', (e) => {
        const data = JSON.stringify(getData());

        document.querySelector('[name="discord-notifications-data"]').value = data
    })
})