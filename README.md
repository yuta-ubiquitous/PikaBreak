# PikaBreak

## 動作環境

- Raspberry Pi 3以降（2以下はBLE対応ドングルが必要）

- Node.js v14.4.0

- USB式のLEDライト

- iBeacon

## 準備

- packageのインストール

```sh
npm install
```

### 設定ファイル

- ディレクトリにconfig.jsonを作成

```
$ cd PikaBreak
$ touch config.json
```

- iBeaconのUUID， Major， Minorを記入

config.json

```json
{
    "beacon":{
        "uuid": "********-****-****-****-************",
        "major": 0,
        "minor": 0
    }
}
```

###  時間

pikabreak.js

``` javascript
  findingDuration = 60 * 1000 // [msec]
  checkDuration = 5 * 60 * 1000 // [msec]
  lightCycle = 6
  lightDuration = 10 * 1000 // [msec]
```

findingDuration： ビーコンの検知時間（１分） 

checkDuration： ビーコンの生存確認時間（5分）

lightCycle： ライトを光らせるまでのcheckDurationの回数 （6回：5*6=30分周期） 

lightDuration： ライトを光らせる時間（10秒）

### 実行
``` sh
npm start
```
or
``` sh
node index.js
```

## その他

### [PM2](https://pm2.keymetrics.io/)
- Raspberry Piが起動すると自動実行してくれる

## ライセンス
```
Copyright 2020 yuta-ubiquitous

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
