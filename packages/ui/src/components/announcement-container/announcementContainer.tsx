import { Component, h } from "preact";
import { ContribLogger, getContribLogger } from "@playkit-js-contrib/common";
import * as styles from "./_announcementContainer.scss";

export interface AnnouncementContainerProps {
    onClose: () => void;
}

export class AnnouncementContainer extends Component<AnnouncementContainerProps> {
    private _logger: ContribLogger = getContribLogger({
        module: "contrib-ui",
        class: "AnnouncementContainer"
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

    render(props: AnnouncementContainerProps) {
        this._logger.trace(`render component`, {
            method: "render"
        });
        return (
            <div className={styles.announcementContainerRoot}>
                <div className={styles.announcementContainer}>
                    <button className={styles.closeButton} onClick={props.onClose} />
                    {this.props.children}
                </div>
            </div>
        );
    }
}
