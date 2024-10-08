<?php
class DiscordNotificationsExtension extends Minz_Extension {

    public $enabled = false;

    public function init() {
        Minz_View::appendScript($this->getFileUrl('scripts/utilities.js', 'js'));
        Minz_View::appendScript($this->getFileUrl('scripts/dynamic-update.js', 'js'));
        Minz_View::appendScript($this->getFileUrl('scripts/collapsible-list.js', 'js'));
        Minz_View::appendScript($this->getFileUrl('scripts/form-control.js', 'js'));
        Minz_View::appendStyle($this->getFileUrl('styles/index.css', 'css'));
        Minz_View::appendStyle($this->getFileUrl('styles/discord-embed.css', 'css'));

        $this->registerHook('entry_before_insert', [$this, 'onFeedUpdate']);
        $this->registerHook('js_vars', [$this, 'addVariables']);

        $this->enabled = true;
    }

    public function onFeedUpdate(FreshRSS_Entry $entry): FreshRSS_Entry {
        if ($entry->isUpdated()) {
            Minz_Log::debug("[DiscordNotificationsExtension] Entry: {$entry->id()}, already exists. Skipping!");
            return $entry;
        }

        foreach ($this->getData() as $data) {
            $webhook_url = $data['webhook_url'];

            if (is_null($webhook_url)) {
                continue;
            }

            if ($data['feed'] != '-1000' && $entry->feedId() != $data['feed']) {
                continue;
            }

            $embeds = [
                'title' => $entry->title(),
                "description" => strip_tags($entry->content()),
                "url" => $entry->link(),
                "color" => hexdec($data['color']),
                "author" => ["name" => $entry->feed()->name() . " - " . implode(', ', $entry->authors())],
                "timestamp" => $entry->machineReadableDate(),
                "footer" => ["text" => $entry->tags(true)],
            ];

            if ($data['display_thumb'] == 'true') {
                $embeds["image"] = $entry->thumbnail();
            }

            $messageData = [
                'embeds' => [$embeds],
                'username' => $data['username'],
                'avatar_url' => $data['avatar']
            ];

            $this->sendWebhook($webhook_url, $messageData);
        }
        return $entry;
    }

    private function sendWebhook(string $url, $data) {
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

        if (curl_errno($ch)) {
            Minz_Log::error(curl_error($ch));
        } else {
            Minz_Log::debug($response);
        }

        curl_close($ch);
        return $response;
    }

    private function getFirstEntryFromFeeds() {
        $databaseDAO = FreshRSS_Factory::createFeedDao();
        $feedsId = $databaseDAO->listFeedsIds();

        $entries = [];

        foreach ($feedsId as $feedId) {
            $feed = $databaseDAO->searchById($feedId);
            $feedEntries = $feed->entries();
    
            if (!empty($feedEntries)) {
                $entry = $feedEntries[0];
                $entryArray = [
                    'title' => $entry->title(),
                    'author' => implode(', ', $entry->authors()),
                    'content' => strip_tags($entry->content(false)),
                    'link' => $entry->link(),
                    'date' => $entry->date(true),
                    'tags' => $entry->tags(true),
                    'thumbnail' => $entry->thumbnail()
                ];
                array_push($entries, $entryArray);
            }
        }

        return $entries ?? [];
    }

    public function handleConfigureAction() {
        if (Minz_Request::isPost()) {
            $data = Minz_Request::paramString('discord-notifications-data', true);
            $configuration = [
                'data' => json_decode($data, true),
            ];

            if (!empty($configuration['data'])) {
                $this->setUserConfiguration($configuration);
            }
        }
    }

    public function addVariables($vars) {
        $vars[$this->getName()]['configuration'] = [
            'data' => $this->getData(),
            'version' => $this->getVersion(),
            'entries_for_embed' => $this->getFirstEntryFromFeeds(),
        ];

        return $vars;
    }

    public function getData() {
        return $this->getUserConfigurationValue('data', [['title' => 'default']]);
    }

    public function getFeeds() {
        $feeds = FreshRSS_Context::feeds();
        $feedNames = array_map(function ($feed) {
            return ['name' => $feed->name(), 'id' => $feed->id()];
        }, $feeds);

        $feedNames += [['name' => 'All Feeds', 'id' => -1000]];
        usort($feedNames, function ($a, $b) {
            return $a['id'] - $b['id'];
        });
        return $feedNames;
    }
}

