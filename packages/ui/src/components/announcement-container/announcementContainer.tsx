import { Component, h } from "preact";
import { ContribLogger, getContribLogger } from "@playkit-js-contrib/common";
import * as styles from "./_announcementContainer.scss";

export interface AnnouncementContainerProps {
    handleCloseEvent: (event: any) => void;
}

export class AnnouncementContainer extends Component<AnnouncementContainerProps> {
    private _logger: ContribLogger | null = null;

    componentDidMount(): void {
        this._logger = getContribLogger({
            module: "contrib-ui",
            class: "AnnouncementContainer"
        });
        this._logger.info(`mount component`, {
            method: "componentDidMount"
        });
    }

    componentWillUnmount(): void {
        if (!this._logger) {
            return;
        }

        this._logger.info(`unmount component`, {
            method: "componentWillUnmount"
        });
    }

    render(props: AnnouncementContainerProps) {
        if (this._logger) {
            this._logger.trace(`render component`, {
                method: "render"
            });
        }
        return (
            <div className={styles.announcementContainerRoot}>
                <div className={styles.announcementContainer}>
                    <button className={styles.closeButton} onClick={props.handleCloseEvent} />
                    {this.props.children}
                </div>
            </div>
        );
    }
}
