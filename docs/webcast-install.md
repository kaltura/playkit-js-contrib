# How to apply V7 Webcast with Kaltura-live and Q&A plugins
To apply the V7 webcast beta you will need to obtain a player-id that is a V7 player and configure it
in KMS kwebcast module as the webcast player.   

Kaltura SaaS will be handling creating a generic player deployment to serve all clients (partner 0).
With that - any partner will have the ability to manage his own player and use it instead.  

### One time Installations (onprems)
If this is an on-prem and not served from Kaltura-SaaS you will need to make sure that: 
1. Core player version is `0.49.0-vamb.1` [installed](https://github.com/kaltura/playkit-js-contrib/releases/tag/kaltura-ovp-player%400.49.0-vamb.1) in your environment 
2. Q&A plugin is [installed](https://github.com/kaltura/playkit-js-qna/releases/tag/v0.7.5) in your environment
3. Kaltura-live plugin is [installed](https://github.com/kaltura/playkit-js-kaltura-live/releases/tag/v1.0.3) in your environment
4. Minimum MediaSpace version - 5.93.13
5. The uiconf that serves VAMB 'latest' is up to date and holds references to `kaltura-live` and `qna` plugins 
6. There is an existing generic player on partner 0 on your environment to serve this feature. See #3 below
> Kaltura SaaS production the generic player id is 44763621. 

# Installation steps

### 1 Enable Webcast module in MediaSpace if missing
Open your MediaSpace admin console, chose the relevant MediaSpace instance and click `manage` next to `Enable Modules`
In the next screen - enable a module called `kwebcast` and hit `save`

### 2 Activate the module in the MediaSpace instance
Go into your MediaSpace instance admin (your MediaSpace url with the postfix `/admin`) and enable the `kwebcast` module
Configure the different fields according to your needs 

### 3 player configuration

##### Generic Player instructions
> OnPrem integrator - you need to create this once per environment. This player must be public on partner 0. 
Name this player 'Webcast V7 Beta'. 
> This section elaborates how to create a generic player per onprem. On Kaltura SaaS we already have such player with id 44763621

Go to Admin Console of your onprem and create a new uiconf. 
- partner id has to be 0 or the environment template partner id accordingly 
- uiconf name - '[DO NOT DELETE] Webcast V7 Beta player'
- width: 560
- height: 395
- creation mode: AppStudio Wizard 
- UI Conf Type: Player
- SWF URL: '/' (without the single quotes) 
- HTML5 URL: leave blank 
- Additional flashvars: '{"kaltura-ovp-player":"0.49.0-vamb.1", "playkit-qna": "{latest}", "playkit-kaltura-live": "{latest}"}'  (without the single quotes)
- Tags: kalturaPlayerJs,player,ovp,webcast,beta 
- Conf File: leave blank
- Studio Features: leave blank
- Config: paste this JSON 
```
{
    "disableUserCache": false,
    "plugins": {},
    "playback": {},
    "provider": {
        "env": {}
    }
}
 ```
 - Is Public: *must be checked* 

Once saved - get the player id and use that as the generic player for V7 webcast Beta 

#### Unique player instructions 
Sometimes there is a need for a unique player configuration (E.G. in case partner needs a unique Google Analytics account). 
In this case you may create your own player instance and use it instead. 
    
In the KMC that is associated with the MediaSpace instance, go to the `Studio` tab and into `TV PLATFORM STUDIO` sub-tab.
Create a new player and name it 'V7 Webcast Player'. Configure it as you wish.  
After you create it - edit it in the admin-console and edit the Additional flashvars to be `{"kaltura-ovp-player":"0.49.0-vamb.1", "playkit-qna": "{latest}", "playkit-kaltura-live": "{latest}" }`
Save it and copy this its id.

> In case of uiconf changes - it might take a while for the data to populate to production because of some caching layers.  
Usually it takes around 10 minutes to be updated. There is a way to expedite that by hitting once a URL of the player 
with `?regenerate=true` at the end of it E.G. 
`https://www.kaltura.com/p/27017/embedPlaykitJs/uiconf_id/44718921?regenerate=true`

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
- **Make sure** not to add a V7 player id to `BSEPlayerUIConfID` as this is not supported
- "type private question" and and reply text are missing from the question text box in IE11 



