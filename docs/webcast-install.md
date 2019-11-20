# How to apply V7 Webcast with Kaltura-live and Q&A plugins

### Prerequisites
If this is an on-prem and not served from Kaltura-SaaS you will need to make sure that: 
- Core player version is `0.49.0-vamb.1` [installed](https://github.com/kaltura/playkit-js-contrib/releases/tag/kaltura-ovp-player%400.49.0-vamb.1) in your environment 
- Q&A plugin is [installed](https://github.com/kaltura/playkit-js-qna/releases/tag/v0.7.5) in your environment
- Kaltura-live plugin is [installed](https://github.com/kaltura/playkit-js-kaltura-live/releases/tag/v1.0.3) in your environment
- Minimum MediaSpace version - 5.93.13

### 1 Enable Webcast module in MediaSpace if missing
Open your MediaSpace admin console, chose the relevant MediaSpace instance and click `manage` next to `Enable Modules`
In the next screen - enable a module called `kwebcast` and hit `save`

### 2 Activate the module in the MediaSpace instance
Go into your MediaSpace instance admin (your MediaSpace url with the postfix `/admin`) and enable the kwebcast module
Configure the different fields according to your needs 

### 3 Create a V7 player and configure it
In the KMC of the same account as the MediaSpace instance, go to the `Studio` tab and into `TV PLATFORM STUDIO` sub-tab.
Create a new player and name it 'V7 Webcast Player'.   
After you create it - edit it in the admin-console and edit the Additional flashvars to be `{"kaltura-ovp-player":"0.49.0-vamb.1", "playkit-qna": "{latest}", "playkit-kaltura-live": "{latest}" }`

Save it and copy this its id.

### 4 MediaSpace installation 
Go to your MediaSpace instance admin-page, to the kwebcast module. Copy and save the existing value of `PlayerUiconfId` 
and use it in case you want to revert the use of V7 player. Paste the player-id from #3 into that field and Save.  

### 5 Test
Follow regular flows to create a new Webcast or utilize an existing one and test. Your player should load V7 with QNA and Kaltura live plugins while using V7 player 


## Known issues / limitations
- Once the player is loaded with kaltura-live plugin and kaltura-qna plugin - it should get only one `loadMedia' action. 
If after it has loaded once, a new loadMedia on the same player would not work. If for some reason your work flows requires 
to reload it again we 
recommend destroying the player and re-embed it from scratch. 



