import { h, Component } from "preact";
import * as styles from "./_upper-bar.scss";

export interface UpperBarProps {}

export class UpperBar extends Component<UpperBarProps> {
    render(props: any) {
        return (
            <div className={styles.root}>
                <div className={styles.rightControls}>
                    <svg width="32" height="32" viewBox="0 0 32 32">
                        <g fill="none" fill-rule="evenodd" opacity=".8" transform="translate(3 5)">
                            <path
                                stroke="#FFF"
                                stroke-width="2"
                                d="M7 21.51L11.575 17H22a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h3v4.51z"
                            />
                            <rect width="15" height="2" x="6" y="6" fill="#FFF" rx="1" />
                            <rect width="11" height="2" x="6" y="10" fill="#FFF" rx="1" />
                        </g>
                    </svg>
                </div>
            </div>
        );
    }
}
