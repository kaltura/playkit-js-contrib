import {PlayerContribRegistry} from '@playkit-js-contrib/common';
import {
  PushNotifications,
  PushNotificationsOptions,
} from './push-notifications';
import {getDomainFromUrl} from './utils';

const ResourceToken = 'PushNotifications';

export class PushNotificationsProvider {
  private instancePool: any = {};

  public static get(
    player: KalturaPlayerTypes.Player,
    options: PushNotificationsOptions
  ): PushNotifications {
    const pushNotificationProviderInstance = PlayerContribRegistry.get(
      player
    ).register(ResourceToken, () => {
      return new PushNotificationsProvider();
    });

    return pushNotificationProviderInstance.getInstance(options);
  }

  getInstance(options: PushNotificationsOptions): PushNotifications {
    const domainUrl = getDomainFromUrl(options.serviceUrl);

    if (!this.instancePool[domainUrl]) {
      const newInstance = new PushNotifications(options);
      this.instancePool[domainUrl] = newInstance;
    }

    return this.instancePool[domainUrl];
  }
}
