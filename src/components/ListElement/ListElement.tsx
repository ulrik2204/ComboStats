import "./ListElement.scss";

// Each list will be connected to the other lsits with the same index.
interface Props {
    titles: string[],
    propertyNames: string[],
    properties: string[][]
}

const ListElement: React.FunctionComponent<Props> = (Props) => {


    return (
        <li className="listElement">
            {(() => {
                const content: JSX.Element[] = []
                for (let i = 0; i < Props.titles.length; i++) {
                    const title = Props.titles[i];
                    const properties = Props.properties[i].join(", ")
                    const propertyName = Props.propertyNames[i]
                    content.push(<div key={i}>
                        {title !== "" && (<><b>{title}</b> <br /></>)}
                        {(propertyName !== "") && <i>{propertyName}</i>}
                        {": " + properties}
                    </div>

                    );
                }
                return content;
            })()}

        </li>
    );
}

export default ListElement