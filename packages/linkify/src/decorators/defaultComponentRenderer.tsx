import { ComponentChild, h } from "preact";

export default (href: string, text: string, key: number): ComponentChild => {
    return (
        <a href={href} key={key} target={"_blank"}>
            {text}
        </a>
    );
};
