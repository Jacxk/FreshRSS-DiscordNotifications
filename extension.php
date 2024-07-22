<?php
class DiscordNotificationsExtension extends Minz_Extension {

    public function init() {
        Minz_View::appendScript($this->getFileUrl('dynamic-update.js', 'js'));
        Minz_View::appendScript($this->getFileUrl('collapsible-list.js', 'js'));
        Minz_View::appendScript($this->getFileUrl('form-control.js', 'js'));
        Minz_View::appendStyle($this->getFileUrl('index.css', 'css'));

        $this->registerHook('entry_before_insert', [$this, 'onFeedUpdate']);
        $this->registerHook('js_vars', [$this, 'addVariables']);
    }

    public function onFeedUpdate(FreshRSS_Entry $entry): FreshRSS_Entry {
        
        foreach ($this->getData() as $data) {
            $webhook_url = $data['webhook_url'];
    
            if (is_null($webhook_url)) {
                return $entry;
            }

            if ($entry->feedId() != $data['feed'] || $data['feed'] != '-1000') {
                return $entry;
            }
    
            $embeds = [
                'title' => $entry->title(),
                "description" => $entry->content(false),
                "url" => $entry->link(),
                "color" => hexdec($data['color']),
                "author" => ["name" => $entry->feed()->name() . " - " . implode(', ', $entry->authors())],
                "timestamp" => $entry->machineReadableDate(),
                "image" => ["url" => $entry->thumbnail()],
                "footer" => ["text" => $entry->tags(true)],
            ];
    
            $data = [
                'embeds' => [$embeds],
                'username' => $data['username'],
                'avatar_url' => $data['avatar']
            ];
    
            $this->sendWebhook($webhook_url, $data);
        }
        return $entry;
    }

    private function sendWebhook($url, $data) {
        $ch = curl_init($url);
        $json_data = json_encode($data);

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($json_data)
        ]);
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
            $data = Minz_Request::paramString('discord-notifications-data', true);
            $configuration = [
                'data' => json_decode($data, true),
            ];
            $this->setUserConfiguration($configuration);
        }
    }

    public function addVariables($vars) {
        $vars[$this->getName()]['configuration'] = [
            'data' => $this->getData(),
            'version' => $this->getVersion(),
        ];

        return $vars;
    }

    public function getData() {
        return $this->getUserConfigurationValue('data', [['title' => 'default']]);
    }

    public function getFeeds() {
        $feeds = FreshRSS_Context::feeds();
        $feedNames = array_map(function($feed) {
            return ['name' => $feed->name(), 'id' => $feed->id()];
        }, $feeds);

        $feedNames += [['name' => 'All Feeds', 'id' => -1000]];
        usort($feedNames, function($a, $b) {
            return $a['id'] - $b['id'];
        });
        return $feedNames;
    }
}

