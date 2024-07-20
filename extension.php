<?php
class DiscordNotificationsExtension extends Minz_Extension {

    public function init() {
        Minz_View::appendScript($this->getFileUrl('dynamic-update.js', 'js'));

        $this->registerHook('entry_before_insert', [$this, 'onFeedUpdate']);
        $this->registerHook('js_vars', [$this, 'addVariables']);
    }

    public function onFeedUpdate(FreshRSS_Entry $entry): FreshRSS_Entry {
        $webhook_url = $this->getWebhookURL();

        if (is_null($webhook_url)) {
            return $entry;
        }

        $embeds = array(
            'title' => $entry->title(),
            "description" => strip_tags($entry->content()),
            "url" => $entry->link(),
            "color" => hexdec($this->getColor()),
            "author" => array("name" => $entry->feed()->name() . " - " . $entry->authors(true)),
            "timestamp" => $entry->machineReadableDate(),
            "image" => array("url" => $entry->thumbnail()),
            "footer" => array("text" => $entry->tags(true)),
        );

        $data = array(
            'embeds' => array($embeds),
            'username' => $this->getUsername(),
            'avatar_url' => $this->getAvatar()
        );

        $this->sendWebhook($webhook_url, $data);
        return $entry;
    }

    private function sendWebhook($url, $data) {
        $ch = curl_init($url);
        $json_data = json_encode($data);

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($json_data)
        ));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);

        if(curl_errno($ch)) {
            Minz_Log::error(curl_error($ch));
        } else {
            Minz_Log::notice($response);
        }

        curl_close($ch);
        return $response;
    }

    public function handleConfigureAction() {
        if (Minz_Request::isPost()) {
            $configuration = [
                'webhookUrl' => (string) Minz_Request::param('webhookUrl'),
                'username' => (string) Minz_Request::param('username'),
                'avatar' => (string) Minz_Request::param('avatar'),
                'color' => (string) Minz_Request::param('color'),
            ];
            $this->setUserConfiguration($configuration);
        }
    }

    public function addVariables($vars) {
        $vars[$this->getName()]['configuration'] = [
            'webhookUrl' => $this->getWebhookURL(),
            'username' => $this->getUsername(),
            'avatar' => $this->getAvatar(),
            'color' => $this->getColor(),
            'version' => $this->getVersion(),
        ];

        return $vars;
    }

    public function getWebhookURL() {
        return $this->getUserConfigurationValue('webhookUrl');
    }

    public function getUsername() {
        return $this->getUserConfigurationValue('username');
    }

    public function getAvatar() {
        return $this->getUserConfigurationValue('avatar');
    }

    public function getColor() {
        return $this->getUserConfigurationValue('color', '#04ff00');
    }
}

