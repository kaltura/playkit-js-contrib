import { Component, h } from "preact";
import { ContribLogger, getContribLogger } from "@playkit-js-contrib/common";
import * as styles from "./_floatingNotificationContainer.scss";

export interface FloatingNotificationContainerProps {
    onClose: () => void;
}

export class FloatingNotificationContainer extends Component<FloatingNotificationContainerProps> {
    private _logger: ContribLogger = getContribLogger({
        module: "contrib-ui",
        class: "FloatingNotificationContainer"
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

    render(props: FloatingNotificationContainerProps) {
        this._logger.trace(`render component`, {
            method: "render"
        });
        return (
            <div className={styles.floatingNotificationContainerRoot}>
                <div className={styles.floatingNotificationContainer}>
                    <button className={styles.closeButton} onClick={props.onClose} />
                    {this.props.children}
                </div>
            </div>
        );
    }
}
