import { Component, h } from "preact";
import * as styles from "./_toast.scss";

export interface ToastProps {
    id: string;
    title: string;
    text: string;
    icon: any;
    onClose: (id: string) => void;
    onClick: () => void;
}

interface ToastState {
    isShown: boolean;
}

export class Toast extends Component<ToastProps, ToastState> {
    state = {
        isShown: true
    };

    private _onClick = () => {
        this.props.onClick();
        this._onClose();
    };

    private _onClose = () => {
        this.setState({ isShown: false });
        this.props.onClose(this.props.id);
    };

    render() {
        const { text, title, icon, onClick } = this.props;

        return (
            <div className={styles.toastWrapper} onClick={onClick}>
                <button className={styles.closeButton} onClick={this._onClose}></button>
                <div className={styles.iconContainer}>
                    <div className={styles.iconWrapper}>{icon}</div>
                </div>
                <div className={styles.toastBody}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.text}>{text}</div>
                </div>
            </div>
        );
    }
}
