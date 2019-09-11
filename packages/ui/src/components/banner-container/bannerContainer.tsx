import { Component, h } from "preact";
import { ContribLogger, getContribLogger } from "@playkit-js-contrib/common";
import * as styles from "./_bannerContainer.scss";

export interface BannerContainerProps {
    onClose: () => void;
}

export class BannerContainer extends Component<BannerContainerProps> {
    private _logger: ContribLogger = getContribLogger({
        module: "contrib-ui",
        class: "BannerContainer"
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

    render(props: BannerContainerProps) {
        this._logger.trace(`render component`, {
            method: "render"
        });
        return (
            <div className={styles.bannerContainerRoot}>
                <div className={styles.bannerContainer}>
                    <button className={styles.closeButton} onClick={props.onClose} />
                    {this.props.children}
                </div>
            </div>
        );
    }
}
