import { Component, h } from "preact";
import { ContribLogger, getContribLogger } from "@playkit-js-contrib/common";
import { FloatingNotificationContent } from "../../floatingNotificationManager";
import * as styles from "./_floatingNotification.scss";

export interface FloatingNotificationProps {
    content: FloatingNotificationContent;
}

export class FloatingNotification extends Component<FloatingNotificationProps> {
    private _logger: ContribLogger = getContribLogger({
        module: "contrib-ui",
        class: "FloatingNotification"
    });

    componentDidMount(): void {
        this._logger.info(`mount component`, {
            method: "componentDidMount"
        });
    }

    componentWillUnmount(): void {
        this._logger.info(`unmount component`, {
            method: "componentWillUnmount"
        });
    }

    render({ content }: FloatingNotificationProps) {
        const { text, title = "Audience asks:", icon = this._defaultIcon() } = content;

        this._logger.trace(`render component`, {
            method: "render"
        });

        return (
            <div
                className={
                    styles.defaultFloatingNotificationRoot +
                    " " +
                    styles.floatingNotificationWrapper
                }
            >
                <div className={styles.iconContainer}>
                    <div className={styles.iconWrapper}>{icon}</div>
                </div>
                <div className={styles.floatingNotificationBody}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.text}>{text}</div>
                </div>
            </div>
        );
    }

    private _defaultIcon() {
        return <div className={styles.iconImage} />;
    }
}
